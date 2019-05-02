const slugify = require('slugify');
const colors = require('colors');
const simpleGit = require('simple-git')();
const readline = require('readline-sync');
const shell = require('shelljs');

const script = process.argv[2].replace(/-/g, '')

const priority = ['P1', 'P2', 'P3', 'P4'];
const branchTypes = ['feature', 'bugfix', 'hotfix'];

const scripts = {
  amend,
  commit: init,
  createBranch,
  stage,
}

const separator = '----------------------------------------------------------------'

/**
 * Error handler function, just get the error and dye it red
 */
function errorHandler(error) {
  console.log('An error ocurred'.red);
  console.log(error);
}

/**
 * init
 * check if could be an amend or just commit
 */
function init() {
  let branchTicketId;
  let commitTicketId;

  simpleGit.status((error, status) => {
    if (error) {
      errorHandler(error);

      return;
    }

    const { current } = status;
    const branchName = current.split('/')[1];
    branchTicketId = branchName ? branchName.split('-')[0] : null;

    simpleGit.log(['-1', '--pretty=%B'], (error, log) => {
      if (error) {
        errorHandler(error);

        return;
      }

      const { latest } = log;
      const { hash } = latest;

      try {
        commitTicketId = hash.match(/\[\d+\]/g)[0].replace(/\[*\]*/g, '');
      }
      catch (err) {
        commitTicketId = null;
      }

      if (commitTicketId === branchTicketId) {
        console.log('Running amend command for ticket:'.magenta, `${commitTicketId}`.green);
        amend();
      } else {
        console.log('Running commit command'.magenta)
        commit();
      }
    });
  });
}

/**
 * Create branch with the name based on the ticket id and title slugified
 */
function createBranch() {
  const ticketData = readline.question('Ticket id and title:'.cyan);
  const branchTypeId = readline.keyInSelect(branchTypes, 'Branch type'.cyan);
  const branchName = `${branchTypes[branchTypeId]}/${slugify(ticketData.toLowerCase())}`;

  if (branchTypeId === -1) {
    console.log('Abort'.red);
    return;
  }

  simpleGit.checkoutLocalBranch(branchName);
}

/**
 * Amend
 * Get the ticketID, ticketPriority, ticketTitle, stagingLink and changelist from the last commit message and amend the commit
 */
function amend() {
  simpleGit.log(['-1', '--pretty=%B'], (error, log) => {
    if (error) {
      errorHandler(error);

      return;
    }

    const { latest } = log;
    const { hash } = latest;
    const ticketId = hash.match(/\[\d+\]/g)[0].replace(/\[*\]*/g, '');
    const ticketPriority = priority.findIndex(p => p === hash.match(/\[P\d{1}\]/g)[0].replace(/\[*\]*/g, ''));
    const ticketTitle = hash.match(/::(.+)/g)[0].replace(':: ', '').trim();
    const stagingLink = hash.match(/Staging:.*/g)[0].replace(/Staging:/g, '').trim();
    const changelist = hash.match(/\* .*/g)
    const changeId = hash.match(/Change-Id:.*/g)[0].replace(/Change-Id:/g, '').trim();

    const conf = {
      amend: true,
      changeId,
      changelist,
      stagingLink,
      ticketId,
      ticketPriority,
      ticketPriority,
      ticketTitle,
    };

    commit(conf);
  })
}

/**
 * Get grow stage subdomain
 * Max lenght = 32 chars
 */
 function getStageSubdomain() {
  return new Promise((resolve, reject) => {
    simpleGit.status((error, status) => {
      if (error) {
        errorHandler(error);
        reject(error);

        return;
      }

      const { current } = status;
      const branchName = current.split('/')[1];
      const subdomain = branchName ? branchName.substring(0, 32) : null;

      console.log('Current branch:', `${current}`.green);
      console.log('Stage subdomain:', `${subdomain}`.green);

      resolve(subdomain);
    });
  })
}

/**
 * Stage
 * Create a grow staging link with the name based on the branchname
 */
async function stage() {
  const subdomain = await getStageSubdomain();

  if (!subdomain) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      shell.exec(`grow stage --subdomain=${subdomain}`, [], resolve);
    } catch(error) {
      reject(error);
    }
  });
}

/**
 * Commit
 * Ask for some data to generate a commit message using a template, data:
 * - ticketID {string}
 * - ticketPriority {id from list}
 * - ticketTitle {string}
 * - stagingLink {string}
 * - changelist {array[string]}
 */
async function commit(conf) {
  const flags = {};

  if (conf && conf.amend) {
    flags['--amend'] = conf.amend;
  }

  console.log('Ctrl + C to exit at any time'.yellow);

  const subdomain = await getStageSubdomain();

  const ticketId = readline.question(`Ticket ID${conf && conf.ticketId ? ` (${conf.ticketId})`.green : ''}: `.cyan, { defaultInput: conf && conf.ticketId });
  const ticketPriority = conf && conf.ticketPriority || readline.keyInSelect(priority, 'Ticket priority: '.cyan);

  if (ticketPriority === -1) {
    console.log('Abort'.red);
    return;
  }

  const ticketTitle = readline.question(`Ticket title${conf && conf.ticketTitle ? ` (${conf.ticketTitle})`.green : ''}: `.cyan, { defaultInput: conf && conf.ticketTitle });
  let stagingLink;
  let createStageLink = null;

  if (subdomain) {
    createStageLink = readline.keyInSelect(['yes', 'no'], `Want to create a staging Link? (subdomain: ${`${subdomain}`.green})`.cyan);
  }

  if (createStageLink === 0) {
    await stage();
    stagingLink = `https://${subdomain}-dot-googwebreview.appspot.com`;
  } else {
    stagingLink = readline.question(`Staging Link${conf && conf.stagingLink ? ` (${conf.stagingLink})`.green : ''}: `.cyan, { defaultInput: conf && conf.stagingLink });
  }

  let changelist = conf && conf.changelist || [];

  console.log('Changelist (hit enter to add a new one, reply "q" to exit):'.cyan);

  changelist.forEach(change => console.log(`${change}`.green));

  readline.promptLoop((change) => {
    const shouldExit = change === 'q';

    if (!shouldExit && change !== '') {
      changelist.push(`* ${change}`);
    }

    return shouldExit;
  });

  const commitMessageArray = [
    `[${priority[ticketPriority]}][${ticketId}] :: ${ticketTitle}`,
    `  Ticket: http://b/${ticketId}`,
    `  Staging: ${stagingLink}`,
    ...changelist.map(change => `  ${change}`),
  ];

  if (conf && conf.changeId) {
    commitMessageArray.push(
      `Change-Id: ${conf.changeId}`,
    );
  }

  simpleGit.commit(
    commitMessageArray,
    [],
    flags,
    (error, data) => {
      if (error) {
        errorHandler(error)
      } else {
        const {
          branch,
          commit,
          summary,
        } = data;

        const {
          insertions,
          deletions,
          changes,
        } = summary;

        console.log(separator);

        if (commit) {
          console.log(
            'Commit',
            `${commit}`.green,
            'created in branch',
            `${branch}`.green,
          );

          console.log(`-+${changes}`.magenta, `++${insertions}`.green, `--${deletions}`.red);
          simpleGit.log(['-1', '--pretty=%B'], (error, log) => {
            if (error) {
              errorHandler(error);

              return;
            }

            const { latest } = log;
            const { hash } = latest;

            console.log('Commit message:'.magenta);

            console.log(hash);

            console.log(separator);
          })
        } else {
          console.log('Nothing to commit'.red);
        }

        console.log(separator);
      }
    });
}

scripts[script]()
