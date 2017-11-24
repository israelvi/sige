var connectionInfo;
connectionInfo = {
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : 'adminezLtfkT',
    password : 'XejMtQqFBYEH',
    database : 'visionelectoral',
    port     : process.env.OPENSHIFT_MYSQL_DB_PORT
};
connectionInfo = {
    host     : 'localhost',
    user     : 'root',
    password : 's@lp@ssw04rD$$',
    database : 'sige'
};

module.exports = connectionInfo;
