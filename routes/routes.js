const { poolPromise } = require('../data/config')
const sql = require('mssql');

const router = app => {
   
    //GET route returning data for main tasks grid
    app.get('/queryTasks/:UserID&:Priority&:showingClosed&:customer&:department&:urgentOnly&:search', async (req, res) => {
        let queryString="EXEC WEB_RETURNQUERIES_NEW";
            if(req.params.Priority!=0){
                queryString =  queryString + " @Priority= " + req.params.Priority;     
            }           
            if(req.params.UserID!=0) {
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString = queryString + " @ActionBy= " +req.params.UserID; 
            }

            if(req.params.showingClosed=='true') {
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString = queryString + " @Closed='y'";
            }
            if(req.params.department!=0){
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString= queryString +" @Department=" +req.params.department;
            }
            if(req.params.customer!=0) {
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString = queryString + " @Customer=" + req.params.customer;
            }
            
            if(req.params.urgentOnly=='true') {
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString = queryString + " @UrgentOnly='y'";
            }

            if(req.params.search!=='nosearchentered') {
                if(queryString.length>30){
                    queryString= queryString + ",";
                }
                queryString = queryString + " @Search='"+ req.params.search + "'";
            }
            //console.log(queryString);
            //console.log(queryString.length);
        try {
            const pool = await poolPromise
            const result = await pool.request()
            
            .query(queryString)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
        
    })

    //GET route for returning notes per taskID
    app.get('/taskHistory/:taskID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .query(`SELECT Users.Username, Users.UserID, FORMAT (Datetime, 'dd/MM/yyyy HH:mm:ss')as Time, [Notes], Minutes FROM [CRM_HISTORY] INNER JOIN USERS ON CRM_HISTORY.UserID = Users.UserID WHERE ([Issue_No] = ${req.params.taskID}) ORDER BY Datetime DESC`)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })


    //POST route for inserting new notes per taskID
    app.post('/addHistory/', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
            

            .input('taskID', sql.VarChar, req.body.Task)
            .input('Notes', sql.VarChar, req.body.Notes)
            .input('ID', sql.VarChar, req.body.userid)
            .input('Minutes', sql.VarChar, req.body.minutes)
        
            .query(`INSERT INTO CRM_HISTORY ( UserID, Issue_No, Notes, Datetime , Minutes ) VALUES ( @ID, @taskID, @Notes , GETDATE() , @Minutes)`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD ADDED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/updateTask/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('taskID', sql.VarChar, req.body.Task)
            .input('Details', sql.VarChar, req.body.Details)
            .input('Notes', sql.VarChar, req.body.Notes)
            .input('Area', sql.VarChar, req.body.Area)
            .input('Application', sql.VarChar, req.body.Application)
            .input('Contact', sql.VarChar, req.body.Contact)
            .input('Estimate', sql.VarChar, req.body.Estimate)
            .input('Priority', sql.VarChar, req.body.Priority)
            .input('Invoice', sql.VarChar, req.body.Invoice)
            .input('DueDate', sql.DateTime, req.body.DueDate)
            .input('Requested', sql.DateTime, req.body.Requested)
            .input('Company_Name', sql.VarChar, req.body.Company_Name)
            .input('Account', sql.VarChar, req.body.Account)
            .input('Department', sql.VarChar, req.body.Department)
            .input('UserId', sql.VarChar, req.body.User)
            


            .query('UPDATE CRM_ISSUES SET ActionBy = @UserId, Department = @Department, Account = @Account, Company_Name = @Company_Name, Details = @Details, Notes = @Notes, Reference = @Application, Reference2 = @Area, Reference3 = @Contact, Priority = @Priority, Estimate = @Estimate, Invoice = @Invoice, DueDate = @DueDate, Requested = @Requested WHERE Issue_No = @taskID', (error, result) => {
                if (error) throw error
                res.status(201).send('DETAILS UPDATED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/addNewTask/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('taskID', sql.VarChar, req.body.Task)
            .input('Details', sql.VarChar, req.body.Details)
            .input('CustomerName', sql.VarChar, req.body.CustomerName)
            .input('CustomerCode', sql.VarChar, req.body.CustomerCode)
            .input('Department', sql.VarChar, req.body.Department)
            .input('Contact', sql.VarChar, req.body.Contact)
            .input('DueDate', sql.DateTime, req.body.DueDate)
            .input('ReqDate', sql.DateTime, req.body.ReqDate)
            .input('Priority', sql.VarChar, req.body.Priority)
            .input('Owner', sql.VarChar, req.body.User)
            .input('UserID', sql.VarChar, req.body.UserID)
            .input('Ref1', sql.VarChar, req.body.Reference1)
            .input('Ref2', sql.VarChar, req.body.Reference2)
            .input('Notes', sql.VarChar, req.body.Notes)
            .input('Estimate', sql.VarChar, req.body.Estimate)
            .input('Invoice', sql.VarChar, req.body.Invoice)
            .input('Urgent', sql.VarChar, req.body.Urgent)

            .query(`INSERT INTO CRM_ISSUES ( Owner_Name, Issue_No, State, Account, Company_Name, Reference, Reference2, Reference3, Estimate , Product_Code, Details, Department, Requested, Time, Complete , Notes,Priority, ActionBy, DueDate, Invoice, Urgent) VALUES ( @Owner, @taskID, 'O', @CustomerCode, @CustomerName, @Ref1, @Ref2, @Contact, @Estimate, '', @Details, @Department, @ReqDate, '0', '0', @Notes, @Priority, @UserID, @DueDate, @Invoice, @Urgent)`, (error, result) => {
                if (error) throw error
                res.status(201).send('TASK ADDED SUCCESSFULLY');
            });
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    })

    app.get('/newTaskId', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SELECT MAX(Issue_No) + 1 FROM CRM_ISSUES')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnCustomers', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('WEB_RETURNCUSTOMERS1')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnDepartments', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SELECT * FROM CRM_DEPARTMENTS ORDER BY Department')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnUsers', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SELECT Username, Email, UserId FROM USERS WHERE Active=1')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })    

    app.get('/returnSelectedTask/:taskID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .query(`SELECT * FROM [CRM_ISSUES] WHERE ([Issue_No] = ${req.params.taskID})`)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.use('/login', async (req, res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .input('User', sql.VarChar, req.body.username)
            .input('Pass', sql.VarChar, req.body.password)


            .query('SELECT * FROM USERS WHERE Username = @User AND Password = @Pass')

            //res.json(result.recordset)
            if(result.recordset.length>0){
                res.send({
                    token: 'q>)*8n[Tfh\TyZAW',
                    username: result.recordset[0].Username,
                    userId: result.recordset[0].UserID
                });
            }
            else {
                res.status(401)
                res.send(result)
            }
        
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnReasons', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SELECT Reason, Code FROM CRM_REASONS WHERE Department=16')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/closeTask/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('taskID', sql.VarChar, req.body.Task)
            .input('ReasonCode', sql.VarChar, req.body.Code)
            .input('Minutes', sql.VarChar, req.body.Minutes)
            .input('Date', sql.VarChar, req.body.Date)


            .query("UPDATE CRM_ISSUES SET Complete = 1, State = 'C', Reason_Code = @ReasonCode, Urgent= null, CloseDate = @Date WHERE Issue_No = @taskID", (error, result) => {
                if (error) throw error
                res.status(201).send('DETAILS UPDATED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/editMultiple/', async(req, res) => {
        let queryString = "UPDATE CRM_ISSUES SET";
        if(req.body.priority){
            queryString = queryString + " Priority = " + req.body.priority;
        }
        if(req.body.priority && req.body.duedate){
            queryString = queryString + ",";
        }
        if(req.body.duedate){
            queryString = queryString + " DueDate = '" + req.body.duedate + "'";
        }
        
        queryString = queryString + " WHERE";
        const requestedTasks = JSON.parse(req.body.tasks);
        for(let i=0; i<requestedTasks.length; i++) {            
            if(i>0) {
                queryString = queryString + " OR";
            }
            queryString = queryString + " Issue_No=" +requestedTasks[i];
        }
        //console.log(queryString);

        
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .query(queryString, (error, result) => {
                if (error) throw error
                res.status(201).send('DETAILS UPDATED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
        
        
    })

    app.post('/openHistory/', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
            

            .input('taskID', sql.VarChar, req.body.taskID)
            .input('ID', sql.VarChar, req.body.userid)
        
            .query(`INSERT INTO CRM_HISTORY ( UserID, Issue_No, Notes, Datetime ) VALUES ( @ID, @taskID, 'Task Created' , GETDATE())`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD ADDED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/reOpenTask/', async (req,res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .input('taskID', sql.VarChar, req.body.taskID)

            .query(`UPDATE CRM_ISSUES SET State='O', Complete=0, Reason_Code=NULL WHERE Issue_No = @taskID`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD ADDED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

        
    })

    app.get('/getSummary/:userID&:priority', async (req, res) => {
        const userID = req.params.userID;
            const priority = req.params.priority;

            const queryString = "SELECT COUNT(Issue_No) FROM CRM_ISSUES WHERE ActionBy=" + userID +  " AND Priority=" + priority + " AND Complete=0";
        
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(queryString)

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getTaskCount', async (req, res) => {
        const userID = req.params.userID;
            const priority = req.params.priority;

            const queryString = "SELECT COUNT(Issue_No) FROM CRM_ISSUES WHERE Complete=0";
        
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(queryString)

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getUserReport/:startDate&:endDate&:user', async(req,res) => {
        var queryString = "WEB_LOADUSERTASKSTATSDETAIL_NEW @From='" + req.params.startDate+  "', @To='" + req.params.endDate+"'";
        if(req.params.user!=='none') {
            queryString= queryString + ", @ActionBy= '" + req.params.user + "'";
        }
        //console.log(queryString)
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(queryString)

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getSupportReport/:startDate&:endDate&:user', async(req,res) => {
        //var queryString = "WEB_LOADQUICKSUPPORTSTATS @From='" + req.params.startDate+  "', @To='" + req.params.endDate+"'";
        
        var queryString = "WEB_LOADQUICKSUPPORTSTATS_NEW @From='"+req.params.startDate+"', @To='"+req.params.endDate+"'"
        if(req.params.user!=='none') {
            queryString= queryString + ", @ActionBy=" + req.params.user;
        }
        //console.log(queryString)
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(queryString)

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    


    app.put('/makeUrgent/', async (req,res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .input('Input', sql.VarChar, req.body.input)
            .input('taskID', sql.VarChar, req.body.taskID)

            .query(`UPDATE CRM_ISSUES SET Urgent = @Input WHERE  Issue_No = @taskID`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

        
    })

    app.put('/checkDueDate/', async (req,res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(`WEB_CHECKDUEDATE`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

        
    })

    //GET route for returning notes per taskID
    app.get('/getCloseTaskGrid/:customer&:user&:start&:end', async (req, res) => {
        let queryString = "EXEC WEB_RETURNCLOSEDTASKS @From='" + req.params.start + "', @To='" + req.params.end + "'"

        if(req.params.customer !== '0'){
            queryString = queryString + ", @Customer=" + req.params.customer;
        }
        if(req.params.user !== '0'){
            queryString = queryString + ", @ActionBy=" + req.params.user;
        }
        //console.log(queryString);
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .query(queryString)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getItems/:taskID', async (req, res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .query(`select * from CRM_ITEMS where Issue_No=` + req.params.taskID)
            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnSupportReasons', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SP_RETURNREASONS @DepartmentID=2')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/addQuickSupport/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('SupportCode', sql.VarChar, req.body.SupportCode)
            .input('User', sql.VarChar, req.body.User)
            .input('Date', sql.DateTime, req.body.Date)
            .input('Details', sql.VarChar, req.body.Details)
            .input('Phone', sql.VarChar, req.body.Phone)
            .input('Email', sql.VarChar, req.body.Email)
            .input('Site', sql.VarChar, req.body.Site)
            .input('Minutes', sql.VarChar, req.body.Minutes)
            .input('Remote', sql.VarChar, req.body.Remote)
            .input('ReasonID', sql.VarChar, req.body.Reason)
            .input('OutOfHours', sql.VarChar, req.body.OutOfHours)

            .query(`INSERT into SUPPORTDETAIL (SupportCode, UserID, Datetime, Details, Phone, Email, Site, TimeSpent, Remote, ReasonID, OutofHours) values (@SupportCode, @User, @Date, @Details, @Phone, @Email, @Site, @Minutes, @Remote, @ReasonID, @OutOfHours)`, (error, result) => {
                if (error) throw error
                res.status(201).send('TASK ADDED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnSupportSummary/:customer', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .query(`SP_RETURNSUPPORTSUMMARY @SupportID=${req.params.customer}`)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getTimeReport/:startDate&:endDate&:user', async(req,res) => {
        //var queryString = "WEB_LOADQUICKSUPPORTSTATS @From='" + req.params.startDate+  "', @To='" + req.params.endDate+"'";
        
        var queryString = "RPT_TIME_BY_CUSTOMER @DateFrom='"+req.params.startDate+"', @DateTo='"+req.params.endDate + "'";
        
        if(req.params.user!=='0') {
            queryString= queryString + ", @UserID=" + req.params.user;
        }
        //console.log(queryString)
       try{
           const pool = await poolPromise
           const result = await pool.request()

           .query(queryString)

           res.json(result.recordset)
       } catch (err) {
           res.status(500)
           res.send(err.message)
       }
    })

    app.get('/getUserTimeReport/:startDate&:endDate', async(req,res) => {
        
        var queryString = "RPT_TIME_BY_USER @DateFrom='"+req.params.startDate+"', @DateTo='"+req.params.endDate + "'";
        
        //console.log(queryString)
       try{
           const pool = await poolPromise
           const result = await pool.request()

           .query(queryString)

           res.json(result.recordset)
       } catch (err) {
           res.status(500)
           res.send(err.message)
       }
    })

    app.put('/closeItem/', async (req,res) => {
        
        //need to loop through and create queryString depending on how many items are being closed
        const itemid = JSON.parse(req.body.itemID);
        //console.log(itemid);
        
        let queryString = "UPDATE CRM_ITEMS SET Complete = " + req.body.input + " WHERE ";

        /*
        for(let i=0; i<itemids.length; i++) {
            queryString= queryString + "ID= " + itemids[i]    + " ";
            if(i!==itemids.length-1){
                queryString = queryString + "OR "
            }
        }
        */

        queryString = queryString + "ID= '" + itemid + "'";

        //console.log(queryString);
        
        
        try{
            const pool = await poolPromise
            const result = await pool.request()



            .query(queryString, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
        
        
    })

    app.post('/addItem/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('Details', sql.VarChar, req.body.Details)
            .input('Task', sql.VarChar, req.body.taskID)
            

            .query(`INSERT INTO CRM_ITEMS (Issue_No, Details, Complete) VALUES (@Task, @Details, 0)`, (error, result) => {
                if (error) throw error
                res.status(201).send('ITEM ADDED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnAlerts', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('WEB_RETURN_ALERT_COUNT')

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnErrors/:code', async (req, res) => {
        let queryString = "WEB_RETURNERRORS ";
        
        if (req.params.code > 0) {
            queryString = queryString + "@CustomerCode= " + req.params.code;
        }
        //console.log(queryString);
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query(queryString)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnProductGrid/:productID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query(` SP_RETURNPRODUCTHISTORY @ProductID=` + req.params.productID + ` `)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/returnProductList', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query(` SELECT * FROM Products ORDER BY ProductName `)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/newUpdateId', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('SELECT MAX(UpdateID) + 1 FROM UpdateHeader')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/addUpdateHeader/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('Username', sql.VarChar, req.body.Username)
            .input('Version', sql.VarChar, req.body.Version)
            .input('ProductID', sql.VarChar, req.body.ProductID)
            

            .query(`INSERT INTO UpdateHeader (ProductID, Datetime, Version, UserName) VALUES (@ProductID, GETDATE(), @Version, @Username)`, (error, result) => {
                if (error) throw error
                res.status(201).send('ITEM ADDED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/addUpdateDetail/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('UpdateID', sql.VarChar, req.body.UpdateId)
            .input('Description', sql.VarChar, req.body.Details)
            .input('Comment', sql.VarChar, req.body.Comment)
            

            .query(`INSERT INTO UpdateDetail (UpdateID, UpdateDesc, HQSComment) VALUES (@UpdateID, @Description, @Comment)`, (error, result) => {
                if (error) throw error
                res.status(201).send('ITEM ADDED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/addUpdateSQL/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .input('UpdateID', sql.VarChar, req.body.UpdateId)
            .input('SQL', sql.VarChar, req.body.Sql)

            .query(`INSERT INTO UpdateSQL (UpdateID, UpdateSQL) VALUES (@UpdateID, @SQL)`, (error, result) => {
                if (error) throw error
                res.status(201).send('ITEM ADDED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })


    app.put('/processErrorConfirmed/', async (req,res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .input('Detail', sql.VarChar, req.body.detail)
            

            .query(`UPDATE HQS_Errors SET Status='C' Where Details LIKE @Detail`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

        
    })

    app.put('/processErrorReviewed/', async (req,res) => {
        try{
            const pool = await poolPromise
            const result = await pool.request()

            .input('Detail', sql.VarChar, req.body.detail)
            

            .query(`UPDATE HQS_Errors SET Status='R' Where Details LIKE @Detail`, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

        
    })

    app.get('/getTimeSpent/:taskID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('WEB_RETURNTIMESPENT @Task= ' + req.params.taskID + ' ')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getErrorCount/:code', async (req, res) => {
        
        let queryString = "SELECT Count(*) FROM HQS_Errors WHERE "
        if (req.params.code > 0) {
            queryString= queryString + "CustomerCode=" + req.params.code + " AND ";
        }
        queryString = queryString + "Status is null";
        //console.log(queryString);
        try {
            const pool = await poolPromise
            const result = await pool.request()

        
            .query(queryString)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })


    app.put('/processErrors/', async (req,res) => {
        let queryString = "UPDATE HQS_Errors SET Status= '"+ req.body.Status + "' WHERE ";

        const requestedErrors = JSON.parse(req.body.Details);
            for(let i=0; i<requestedErrors.length; i++) {            
                if(i>0) {
                    queryString = queryString + " OR";
                }
                queryString = queryString + " Details LIKE '" +requestedErrors[i] + "' ";
            }
        //console.log(queryString);
        try{
            const pool = await poolPromise
            const result = await pool.request()
            .query(queryString, (error, result) => {
                if (error) throw error
            
                res.status(201).send(`RECORD UPDATED SUCCESSFULLY`);
            });      
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }        
    })

    app.get('/getTopSupportCustomers', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('RPT_TOP_SUPPORT_CUSTOMERS')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getTopSelectedCustomers', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('Select Web_List_Placement, Customer_Code, Customer_Name from CUSTOMERS WHERE Web_List_Placement IS NOT NULL ORDER BY Web_List_Placement ')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/updateCustomerList/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()


            .query('WEB_UPDATE_CUSTOMER_LIST @One='+ req.body.one + ', @Two='+ req.body.two + ', @Three='+ req.body.three + ', @Four='+ req.body.four + ', @Five='+ req.body.five + ', @Six='+ req.body.six + ', @Seven='+ req.body.seven + ', @Eight='+ req.body.eight + ', @Nine='+ req.body.nine + ', @Ten='+ req.body.ten + ' ', (error, result) => {
                if (error) throw error
                res.status(201).send('DETAILS UPDATED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.put('/resetCustomerList/', async(req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()


            .query('UPDATE CUSTOMERS SET Web_List_Placement = NULL', (error, result) => {
                if (error) throw error
                res.status(201).send('DETAILS UPDATED SUCCESSFULLY');
            });
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })


    app.get('/getEstimateSummary', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('WEB_ESTIMATE_TIME_PER_USER')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/getScheduledTimeByWeek/:startDate&:endDate', async(req,res) => {
        
        var queryString = "RPT_SCHEDULE_BY_WEEK @DateFrom='"+req.params.startDate+"'";
        
        //console.log(queryString)
       try{
           const pool = await poolPromise
           const result = await pool.request()

           .query(queryString)

           res.json(result.recordset)
       } catch (err) {
           res.status(500)
           res.send(err.message)
       }
    })

}
module.exports = router;



