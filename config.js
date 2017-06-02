module.exports = {
	/*
	* JOB_OPTIONS: run backup process on every given second, minutes, hours etc.
	* for example: if you want to run backup job on every hour 00 of day you must set this option to like this: { hour: 0 }
	* available keys are: 
		second
		minute
		hour
		date
		month
		year
		dayOfWeek
	* for the detailed description please read: https://github.com/node-schedule/node-schedule#recurrencerule-properties
	*/
	JOB_OPTIONS: process.env.JOB_OPTIONS || '{ "hour": 15, "minute": 18 }',
	

	/*
	* BACKUP_OPTIONS: run backup process with this options
	* for detailed description please read: https://github.com/hex7c0/mongodb-backup
	*/
	BACKUP_OPTIONS: process.env.BACKUP_OPTIONS || `{"uri": "mongouri", "root": "${__dirname}","collections": ["thing","thingDef","location","geofence","model","geofence_history"],"tar": "dump.tar"}`
};
