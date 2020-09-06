global.appResource = require("./scripts/appResource.json");
global.config = require("./scripts/config.json");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//var auth = require("./scripts/auth");
var auth = require("./scripts/authJWT");
var logger = require("morgan");
var mysql = require("mysql");
var handlebars = require("express-handlebars");
// var helper = require("ip_backend/helper");
var hbs = require("hbs");
var app = express();
var swaggerUi = require("swagger-ui-express");
var router = express.Router();
var swaggerDocument = require("../ip_backend/swagger.json");
const multer = require("multer");
const csv = require("fast-csv");
var upload = multer({ dest: 'uploads/' });
var Upload = multer({ dest: 'public/images' });
var Resume = multer({ dest: __dirname + '/uploads/resume' });
const fs = require('fs');
const csvParser = require('csv-parser');
const filepath = './user.csv'
var hrcsv = multer({ dest: __dirname + '/uploads/hrcsv' })

//swagger-API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// development only
if (app.get("env") == "development") {
  global.config = require("./scripts/config.json");
} else if (app.get("env") == "production") {
  config = require("./scripts/configProd.json");
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

global.pool = mysql.createPool({
  host: global.config.dbUrl,
  user: global.config.dbLogin.username,
  port: global.config.dbPort,
  password: global.config.dbLogin.password,
  database: global.config.dbInstance,
  connectionLimit: global.config.dbConnectionLimit,
  multipleStatements: true
 
});


var routes = require("./routes");
// // view engine setup
// app.set("views",  path.join(__dirname, "views"));
// app.set("view engine", "hbs");
// view engine setup

app.set("views", path.join(__dirname, "/views"));
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views"),
    defaultLayout: "",
    partialsDir: [path.join(__dirname, "views")],
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      }
    }
  })
);

app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, 'uploads/images')));


auth.setup(app, router);
//app.use(router);
app.use("/", router);

//test endpoint
router.get("/", routes.default.index);

//open endpoints
router.post("/api/user/addUser", routes.users.addUser);

//Users MODULE
router.get("/api/users/:id", auth.ensureAuth, auth.checkAPIAccess, routes.users.getUsers);
router.get("/api/users", auth.ensureAuth, auth.checkAPIAccess, routes.users.getUsers);
router.post("/api/users", auth.ensureAuth, auth.checkAPIAccess, routes.users.addUser);
router.patch("/api/users/:id", auth.ensureAuth, auth.checkAPIAccess, routes.users.editUser);
router.delete("/api/users/:id", auth.ensureAuth, auth.checkAPIAccess, routes.users.deleteUser);
router.get("/api/salesUser", routes.users.getSalesUser);
router.post("/api/imageupload/:id", Upload.single('file'), routes.users.imageupload);

//Departments MODULE
//passport.authenticate('jwt', {session: false})
router.get(
  "/api/department",
  auth.ensureAuth,
  auth.checkAPIAccess,
  routes.department.getDepartments
);
router.get(
  "/api/department/:id", auth.ensureAuth, auth.checkAPIAccess, routes.department.getDepartments);
router.post("/api/department", auth.ensureAuth, auth.checkAPIAccess, routes.department.addDepartment);
router.patch("/api/department/:id", auth.ensureAuth, auth.checkAPIAccess, routes.department.editDepartment);
router.delete("/api/department/:id", auth.ensureAuth, auth.checkAPIAccess, routes.department.deleteDepartment);

//Permissions
router.get("/api/getPermissions", auth.ensureAuth, auth.checkAPIAccess, routes.getPermissions.getPermissions);

// Performance Matrix Main Parameters
router.get("/api/PerformanceMatrixMainParameters", auth.ensureAuth, auth.checkAPIAccess,
  routes.getPerformance.getperformances
);

router.get(
  "/api/PerformanceMatrixMainParameters/:id", auth.ensureAuth, auth.checkAPIAccess, routes.getPerformance.getperformances
);

router.post(
  "/api/PerformanceMatrixMainParameters",
  auth.ensureAuth, auth.checkAPIAccess, routes.getPerformance.addperformance
);

router.patch(
  "/api/PerformanceMatrixMainParameters/:id",
  auth.ensureAuth, auth.checkAPIAccess, routes.getPerformance.editPerformance
);
router.delete(
  "/api/PerformanceMatrixMainParameters/:id",
  auth.ensureAuth, auth.checkAPIAccess, routes.getPerformance.deleteperformance
);

//API of Performance Matrix Sub Parameters module.
router.get(
  "/api/PerformanceMatrixSubParameters", auth.ensureAuth, auth.checkAPIAccess,
  routes.subPerformance.getsubperformances
);
router.post(
  "/api/PerformanceMatrixSubParameters", auth.ensureAuth, auth.checkAPIAccess,
  routes.subPerformance.addsubperformance
);
router.get(
  "/api/PerformanceMatrixSubParameters/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.subPerformance.getsubperformances
);
router.patch(
  "/api/PerformanceMatrixSubParameters/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.subPerformance.editsubPerformance
);
router.delete(
  "/api/PerformanceMatrixSubParameters/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.subPerformance.deletesubperformance
);

//API of Matrix Calculations/Evaluation Parameters

router.get(
  "/api/matrixCalculation/addcalculation", auth.ensureAuth, auth.checkAPIAccess,
  routes.matrixCalculation.getAllCalculationMatrix
);

router.get(
  "/api/matrixEvaluation", auth.ensureAuth, auth.checkAPIAccess,
  routes.matrixCalculation.getmatrixEvaluation
);

router.post(
  "/api/matrixCalculation/calculateUserPerformance", auth.ensureAuth, auth.checkAPIAccess,
  routes.matrixCalculation.addmatrixResponse
);

//TODO userID(TIMELOG MODULE)
router.get("/api/timelog", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.gettimelog);
router.get("/api/timelog/:id", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.gettimelog);
router.get("/api/timelog/checkouttime/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.checkouttime);
router.get("/api/timelog/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.todaytimelog);
router.get("/api/weektimelog/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.weeklytimelog);
router.post("/api/timelog", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.addtimelog);
router.patch("/api/timelog/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.timelog.editlog);

//MOM(Minutes Of Meeting MODULE)
router.get("/api/mom", auth.ensureAuth, auth.checkAPIAccess, routes.mom.getmomfields);
router.post("/api/mom", auth.ensureAuth, auth.checkAPIAccess, routes.mom.addmomfields);
router.get("/api/mom/:guid", auth.ensureAuth, auth.checkAPIAccess, routes.mom.getmomfields);
router.patch("/api/mom/:guid", auth.ensureAuth, auth.checkAPIAccess, routes.mom.editmomfields);
router.delete("/api/mom/:guid", auth.ensureAuth, auth.checkAPIAccess, routes.mom.deletemomfields);


//Proposal Submission MODULE
router.post(
  "/api/proposalsubmission", auth.ensureAuth, auth.checkAPIAccess,
  routes.proposalsubmission.addProposalFields
);
router.get(
  "/api/proposalsubmission", auth.ensureAuth, auth.checkAPIAccess,
  routes.proposalsubmission.getProposalFields
);

router.post("/api/csvfileupload", auth.ensureAuth, auth.checkAPIAccess, upload.single('file'), routes.proposalsubmission.csvfileupload);

router.get(
  "/api/proposalsubmission/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.proposalsubmission.getProposalField
);
router.patch(
  "/api/proposalsubmission/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.proposalsubmission.editProposalFields
);
router.delete(
  "/api/proposalsubmission/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.proposalsubmission.deleteProposalFields
);

router.post("/api/rexproposal", routes.proposalsubmission.addrexproposal);

//Discussion Module
router.get("/api/discussion", auth.ensureAuth, auth.checkAPIAccess, routes.discussion.getDiscussionFields);
router.get(
  "/api/discussion/:proposalId", auth.ensureAuth, auth.checkAPIAccess,
  routes.discussion.getDiscussionFields
);

//HR[candidacy] MODULE
router.patch("/api/uploadresume/:id", auth.ensureAuth, auth.checkAPIAccess, Resume.single('file'), routes.hrcandidacy.uploadresume);
router.post("/api/hrcandidacy", auth.ensureAuth, auth.checkAPIAccess, Resume.single('resume'), routes.hrcandidacy.addCandidacyFields);
router.get("/api/hrcandidacy", auth.ensureAuth, auth.checkAPIAccess, routes.hrcandidacy.getCandidacyFields);
router.get("/api/hrcandidacy/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrcandidacy.getCandidacyFields);
router.patch("/api/hrcandidacy/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrcandidacy.editCandidacyFields);
router.delete("/api/hrcandidacy/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrcandidacy.deleteCandidacyFields);
router.post("/api/csvupload", auth.ensureAuth, auth.checkAPIAccess, hrcsv.single('csv'), routes.hrcandidacy.csvfileupload);

//ADD Vacancy MODULE
router.post("/api/hrvacancies", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.addVacancies);
router.get("/api/hrvacancies", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.getVacancies);
router.get("/api/hrvacancies/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.getVacancies);
router.patch("/api/hrvacancies/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.editVacancies);
router.delete("/api/hrvacancies/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.deleteVacancies);

router.get("/api/hrtargets", auth.ensureAuth, auth.checkAPIAccess, routes.hrVacancies.getHrtarget);

//Leave Management Module
router.post("/api/leaveManagement", auth.ensureAuth, auth.checkAPIAccess, routes.leaveManagement.addLeaveManagFields);
router.get("/api/leaveManagement", auth.ensureAuth, auth.checkAPIAccess, routes.leaveManagement.getLeaveManagFields);
router.get(
  "/api/leaveManagement/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.getLeaveManagFields
);
router.patch(
  "/api/leaveManagement/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.editLeaveManagFields
);
router.delete(
  "/api/leaveManagement/:id", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.deleteLeaveManagFields
);

router.post(
  "/api/leaveCalculationRecords", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.addleaveRecord
);
router.get(
  "/api/leaveCalculationRecords", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.getleaveRecord
);
router.get(
  "/api/leaveCalculationRecords/:userId", auth.ensureAuth, auth.checkAPIAccess,
  routes.leaveManagement.getleaveRecord
);

//Training module
router.post("/api/training", auth.ensureAuth, auth.checkAPIAccess, routes.training.addtrainingSyllabus);
router.get("/api/training", auth.ensureAuth, auth.checkAPIAccess, routes.training.getTrainingSyllabus);
router.get("/api/training/:id", auth.ensureAuth, auth.checkAPIAccess, routes.training.getTrainingSyllabus);
router.patch("/api/training/:id", auth.ensureAuth, auth.checkAPIAccess, routes.training.editTrainingSyllabus);
router.delete("/api/training/:id", auth.ensureAuth, auth.checkAPIAccess, routes.training.deleteTrainingSyllabus);

//USERTRAININGRESPONSE
router.post("/api/usertrainingResponse", auth.ensureAuth, auth.checkAPIAccess, routes.training.addSyllabusResponse);
router.get("/api/usertrainingResponse", auth.ensureAuth, auth.checkAPIAccess, routes.training.getSyllabusResponse);

//Announcement Module
router.post("/api/announcement", auth.ensureAuth, auth.checkAPIAccess, routes.announcement.addannouncements);
router.get("/api/announcement", auth.ensureAuth, auth.checkAPIAccess, routes.announcement.getannouncements);
router.get("/api/announcement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.announcement.getannouncements);
router.patch("/api/announcement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.announcement.editannouncements);
router.delete("/api/announcement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.announcement.deleteannouncements);

//SalesTarget
router.get("/api/salesTarget", auth.ensureAuth, auth.checkAPIAccess, routes.sales.getsalesTarget);
router.get("/api/salesTarget/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.sales.getsalesTarget);

//FOR ADMIN
router.post("/api/addsalesTarget", auth.ensureAuth, auth.checkAPIAccess, routes.sales.addsalesTarget);
router.get("/api/getTarget", auth.ensureAuth, auth.checkAPIAccess, routes.sales.getTarget);
router.get("/api/getTarget/:id", auth.ensureAuth, auth.checkAPIAccess, routes.sales.getTarget);
router.patch("/api/getTarget/:id", auth.ensureAuth, auth.checkAPIAccess, routes.sales.editTarget);


//CRM Management
router.post("/api/CRM", auth.ensureAuth, auth.checkAPIAccess, routes.crm.addcrmFields);
router.get("/api/CRM", auth.ensureAuth, auth.checkAPIAccess, routes.crm.getcrmFields);
router.get("/api/CRM/:id", auth.ensureAuth, auth.checkAPIAccess, routes.crm.getcrmFields);
router.patch("/api/CRM/:id", auth.ensureAuth, auth.checkAPIAccess, routes.crm.editcrmFields);
router.delete("/api/CRM/:id", auth.ensureAuth, auth.checkAPIAccess, routes.crm.deletecrmFields);

//Priority Status Module

//router.post("/api/csv", routes.prioritystatus.getcsv);
//router.post("/api/csv", upload.single("file"), function(req, res) {});

router.post("/api/prioritystatus", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.addstatus);
router.get("/api/prioritystatus", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.getstatus);
//router.get("/api/prioritystatus/:id", routes.prioritystatus.getstatus);
router.patch("/api/prioritystatus/:id", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.editstatus);
router.delete("/api/prioritystatus/:id", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.deletestatus);

router.get("/api/prioritystatus/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.getstatus);
router.get("/api/workinghours/:userId", auth.ensureAuth, auth.checkAPIAccess, routes.prioritystatus.gethoursRecord);


//REVENUE REPORTS ENDPOINTS :-
router.post("/api/revenue", auth.ensureAuth, auth.checkAPIAccess, routes.revenue.addRevenues);
router.get("/api/revenue", auth.ensureAuth, auth.checkAPIAccess, routes.revenue.getRevenues);
router.get("/api/revenue/:id", auth.ensureAuth, auth.checkAPIAccess, routes.revenue.getRevenues);
router.patch("/api/revenue/:id", auth.ensureAuth, auth.checkAPIAccess, routes.revenue.editRevenues);


//Project Management Endpoints :- 
router.post("/api/projectManagement", auth.ensureAuth, auth.checkAPIAccess, routes.projectManagement.addProjectDetails);
router.get("/api/projectManagement", auth.ensureAuth, auth.checkAPIAccess, routes.projectManagement.getProjectDetails);
router.get("/api/projectManagement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.projectManagement.getProjectDetails);
router.patch("/api/projectManagement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.projectManagement.editProjectDetails);

//Task Management Endpoints :- 
router.post("/api/taskManagement", auth.ensureAuth, auth.checkAPIAccess, routes.taskManagement.addTask);
router.get("/api/taskManagement", auth.ensureAuth, auth.checkAPIAccess, routes.taskManagement.getTask);
router.get("/api/taskManagement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.taskManagement.getTask);
router.patch("/api/taskManagement/:id", auth.ensureAuth, auth.checkAPIAccess, routes.taskManagement.editTask);

//HRIS[Human Resource Infomation System]
router.post("/api/HRIS", auth.ensureAuth, auth.checkAPIAccess, routes.hris.addhris);
router.get("/api/HRIS", auth.ensureAuth, auth.checkAPIAccess, routes.hris.gethris);
router.get("/api/HRIS/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hris.gethris);
router.patch("/api/HRIS/:id", auth.ensureAuth, auth.checkAPIAccess, routes.hris.edithris);

// Dashboard Module
router.get("/api/getAttendance", auth.ensureAuth, auth.checkAPIAccess, routes.dashboard.getAttendance);
router.get("/api/getBirthday", auth.ensureAuth, auth.checkAPIAccess, routes.dashboard.dashboard);

//Holidays module
router.post("/api/holiday", auth.ensureAuth, auth.checkAPIAccess, routes.holiday.addHoliday);
router.get("/api/holiday", auth.ensureAuth, auth.checkAPIAccess, routes.holiday.getHoliday);
router.get("/api/holiday/:id", auth.ensureAuth, auth.checkAPIAccess, routes.holiday.getHoliday);
router.patch("/api/holiday/:id", auth.ensureAuth, auth.checkAPIAccess, routes.holiday.editHoliday);
router.delete("/api/holiday/:id", auth.ensureAuth, auth.checkAPIAccess, routes.holiday.deleteHoliday);

//dummy
router.get("/api/dashboard", routes.dashboard.dashboard);
router.get("*", routes.default.notFound);



//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
