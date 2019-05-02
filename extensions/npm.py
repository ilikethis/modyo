"""Preprocessor for running npm tasks."""
from grow.sdk import sdk_utils
from protorpc import messages
import grow
import os
import shlex
import subprocess

_child_processes = []

class Config(messages.Message):
  build_task = messages.StringField(1, default='build')
  run_task = messages.StringField(2, default='')
  command = messages.StringField(3, default='npm')

class Preprocessor(grow.Preprocessor):
  KIND = 'npm'
  Config = Config

  def _get_command(self, task):
      commands = [self.config.command, task]
      if self.pod.file_exists('/.nvmrc'):
          commands = ['nvm run'] + commands
      return ' '.join(commands)

  def run(self, build=True):
      if 'RESTARTED' in os.environ:
          return
      task = self.config.build_task if build else self.config.run_task
      command = self._get_command(task)
      args = sdk_utils.subprocess_args(self.pod, shell=True)
      process = subprocess.Popen(command, **args)
      _child_processes.append(process)
      if not build:
          return
      code = process.wait()
      if code != 0:
          text = 'Failed to run: {}'.format(command)
