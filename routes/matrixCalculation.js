var performanceModel = require("../models/performanceMatrix");
var subperformanceModel = require("../models/subPerformanceMatrix");
var matrixEvaluationModel = require("../models/matrixUserResponse");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const uuid = require("uuid/v4");

module.exports = {
  getAllCalculationMatrix: async function (req, res, next) {
    const matrixMainParameters = await performanceModel.getperformances();

    const matrixSubParameters = await subperformanceModel.getsubperformances();

    const matrixEvaluation = await matrixEvaluationModel.getmatrixEvaluation();
    let grouping = {};

    matrixMainParameters.forEach(function (el, index) {
      grouping[el.name] = matrixSubParameters.filter(function (sel) {
        return sel.parentId == el.id;
      });
    });
    //return res.render("addmatrixCalculation", { result });
    return res.json({
      result: appResource.success,
      data: {
        grouping,
        matrixMainParameters,
        matrixSubParameters,
        matrixEvaluation
      }
    });
  },
  getmatrixEvaluation: async function (req, res, next) {
    matrixEvaluationModel
      .getmatrixEvaluation()
      .then(
        function (result) {
          console.log(">>>>>RESSDDD", result);
          return res.json({ result: appResource.success, data: result });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  },

  addmatrixResponse: async function (req, res, next) {
    console.log("req.user>>>>>", req.user)
    // if (!req.body.UserResponseId) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest});
    // }
    //const UserResponseId = req.body.answers;
    const matrixEvaluations = await matrixEvaluationModel.getmatrixEvaluation();

    let data = {};
    let allData = [];
    function sum(obj) {
      var sum = 0;
      for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
          sum += parseFloat(obj[el]);
        }
      }
      return sum;
    }

    matrixEvaluations.forEach(c => {
      return (data[c.id] = c.points);
    });

    let myGrades = req.body.UserResponseId;

    myGrades = myGrades.split("|");
    const subCategoriesData = await subperformanceModel.getsubperformance({
      id: req.params.id
    });

    console.log(">>>>>>>>>>>>>>>>>>>", subCategoriesData)

    let data1 = {};
    subCategoriesData.forEach(d => {
      data1[d.id] = {
        parentId: d.parentId,
        parentName: d.name,
        percentage: d.percentage
      };
    });

    myGrades.forEach(function (el, index) {
      var currentEl = el.split(",");
      if (currentEl.length == 2 && data1[currentEl[0]]) {
        allData.push({
          subCategoryId: currentEl[0],
          responseId: currentEl[1],
          points: data[currentEl[1]],
          parentData: data1[currentEl[0]]
        });
      }
    });
    let grouping = {};
    allData.forEach(function (el, index) {
      grouping[el.parentData.parentName] = allData.filter(function (sel) {
        return sel.parentData.parentId == el.parentData.parentId;
      });
    });

    let points = [];
    Object.keys(grouping).map(key => {
      const value = grouping[key].map(el => {
        console.log("element>>>", el.parentData.parentId);
        return el.points;
      });

      points = { ...points, [key]: value };
    });

    var totalPercentage = [];
    Object.keys(points).forEach(key => {
      var totalpoints = sum(points[key]) / points[key].length;
      totalPercentage.push(totalpoints);
      console.log("Percentage>>>>>", totalPercentage);
    });

    var totalpercentage = JSON.stringify(totalPercentage);
    console.log("res>>>>>>>>", totalpercentage);

    const paramData = {
      UserResponseId: req.body.UserResponseId,
      userId: req.body.userId,
      totalpercentage: totalpercentage
    };
    console.log("paramdata>>>>", req.body);

    const matrixEvaluation = await matrixEvaluationModel.getmatrixEvaluation({
      id: req.params.id
    });
    console.log("Matrix Evaluation>>>,", matrixEvaluation);

    matrixEvaluationModel
      .addResponse(paramData)
      .then(
        function (result) {
          return res.json({
            result: appResource.success,
            data: { locationID: result.insertId }
          });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  }

  // totalpercentage: async function(req, res, next) {
  //   const matrixEvaluation = await matrixEvaluationModel.getmatrixEvaluation();
  //   // console.log("matrixEvaluation>>>>>", matrixEvaluation);
  //   let data = {};
  //   let allData = [];
  //   function sum(obj) {
  //     var sum = 0;
  //     for (var el in obj) {
  //       if (obj.hasOwnProperty(el)) {
  //         sum += parseFloat(obj[el]);
  //       }
  //     }
  //     return sum;
  //   }

  //   matrixEvaluation.forEach(c => {
  //     return (data[c.id] = c.points);
  //   });
  //   let myGrades = await matrixEvaluationModel
  //     .getparameters()
  //     .then(d =>
  //       d.map(key => {
  //         return { points: key.UserResponseId };
  //         // key.UserResponseId;
  //       })
  //     )
  //     .fail(logger.handleError);

  //   // let myGrades = await matrixEvaluationModel
  //   //   .getparameters()
  //   //   .then(d => d[0].UserResponseId)
  //   //   .fail(logger.handleError);

  //   console.log("MyGrades>>>>>>>>", myGrades[1].points);

  //   myGrades = myGrades.map(key => {
  //     return { points: key.points.split("|") };
  //   });

  //   console.log("MyGrades<>>>>>", myGrades);
  //   const subCategoriesData = await subperformanceModel.getsubperformances();
  //   console.log("SUB DATA>>>>>>>>>", subCategoriesData);
  //   let data1 = {};
  //   subCategoriesData.forEach(d => {
  //     data1[d.id] = {
  //       parentId: d.parentId,
  //       parentName: d.name,
  //       percentage: d.percentage
  //     };
  //   });

  //   myGrades.forEach(function(el, index) {
  //     var currentEl = el.split(",");
  //     if (currentEl.length == 2 && data1[currentEl[0]]) {
  //       allData.push({
  //         subCategoryId: currentEl[0],
  //         responseId: currentEl[1],
  //         points: data[currentEl[1]],
  //         parentData: data1[currentEl[0]]
  //       });
  //     }
  //   });

  //   let grouping = {};
  //   allData.forEach(function(el, index) {
  //     grouping[el.parentData.parentName] = allData.filter(function(sel) {
  //       return sel.parentData.parentId == el.parentData.parentId;
  //     });
  //   });
  //   let points = [];
  //   // let dummy = {};
  //   // grouping.forEach(function(el, index) {
  //   //   console.log("value>>", el);
  //   //   console.log("k>>>>>>>>>", index);
  //   // });
  //   Object.keys(grouping).map(key => {
  //     console.log("key>>>", key);
  //     const value = grouping[key].map(el => {
  //       console.log("element>>>", el.parentData.parentId);
  //       return el.points;
  //     });

  //     points = { ...points, [key]: value };
  //   });

  //   var totalPercentage = [];
  //   Object.keys(points).forEach(key => {
  //     totalPercentage.push({ [key]: sum(points[key]) / points[key].length });
  //   });

  //   //console.log(total);
  //   res.json({
  //     totalPercentage,
  //     grouping
  //   });
  // }
};
