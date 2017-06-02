'use strict';

const debugInfo = require('debug')('backup-info');
const debugWarning = require('debug')('backup-warning');
const debugError = require('debug')('backup-error');

const fs = require('fs');
const pathHelper = require('path');
const schedule = require('node-schedule');
const backup = require('mongodb-backup');
const async = require('async');

const config = require('./config');

var lastJob = null;

class Backup {
  constructor() {
  	debugger;
  	debugInfo('Backup Starting...');

  	// parse config items from string to object
  	require('./config-parser')();


  	this.m_isReady = false;
  	this.m_isStarted = false;

    if (!config.BACKUP_OPTIONS) {
		return debugError('Backup configuration were not set');
	}

	if (!config.JOB_OPTIONS) {
		return debugError('Job options were not set');	
	}

	let availableKeys = ['second','minute','hour','date','month','year','dayOfWeek'];
	let givenKeys = Object.keys(config.JOB_OPTIONS);
	for (let i = 0; i < givenKeys.length; i++) {
		if (availableKeys.indexOf(givenKeys[i]) == -1) {
			return debugError(`Unknown job key ${givenKeys[i]} were set`);
		}
		if (!Number.isInteger(config.JOB_OPTIONS[givenKeys[i]])) {
			return debugError(`Unknown given value ${config.JOB_OPTIONS[givenKeys[i]]} of job key ${givenKeys[i]} were set`);	
		}
	}

	this.m_isReady = true;
  }

  get isReady() {
  	return this.m_isReady;
  }

  get isStarted() {
  	return this.m_isStarted;
  }

  start() {
  	if (!this.isReady) {
  		return debugError('Could not start the schedule because of the process has not ready yet!');
  	}

  	lastJob = schedule.scheduleJob(config.JOB_OPTIONS, function() {

      async.waterfall([

        function(callback) {
              
          let tempName = "temp.rar";
          let tempPath = pathHelper.join(config.BACKUP_OPTIONS.root, tempName);
          let realPath = pathHelper.join(config.BACKUP_OPTIONS.root, config.BACKUP_OPTIONS.tar);

          callback(null, tempName, tempPath, realPath);

        },

        // remove the old backup file
        function(tempName, tempPath, realPath, callback) {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
          callback(null, tempName, tempPath, realPath);
        },

        // save new backup file to temp
        function(tempName, tempPath, realPath, callback) {
          let backupOptions = config.BACKUP_OPTIONS;
          backupOptions['tar'] = tempName;
          backupOptions['callback'] = function(err) {
            return callback(err, tempName, tempPath, realPath);
          }
          backup(backupOptions);
        },

        // rename backup file name to its original name
        function(tempName, tempPath, realPath, callback) {
          fs.rename(tempPath, realPath, callback);
        },

      ], function(err) {
        debugError('Error occurred during backup operation', err);
      });
    });

  	this.m_isStarted = true;

  }

  stop() {
  	if (!this.isStarted || !lastJob) {
  		return;
  	}

  	lastJob.cancel();
  	m_isStarted = false;
  }
}

module.exports = Backup;