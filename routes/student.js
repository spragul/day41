var express = require('express');
var router = express.Router();
const { studentModel } = require('../schemas/studentschema');
const { mentorModel } = require('../schemas/mentorSchema');
const mongoose = require('mongoose');
const { dbUrl } = require('../common/dbconfig');
mongoose.connect(dbUrl)


/* GET student listing. */
router.get('/', async function(req, res) {
  try {
    let student = await studentModel.find();
    res.status(200).send({
      student,
      message:"Student Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
});

/* GET Student All mentor  */
router.get('/all', async function (req, res) {
  try {
    let student = await studentModel.find({}, {});
    let array = [];
    let arr = {
      mentors: "",
      students: ""
    };
    for (let i in student) {
      let a = student[i].mentors;
      let mentors = student[i].mentors[a.length - 1];
      let students = student[i].name;

      arr = {
        mentors: mentors,
        students: students
      }
      array.push(arr);
    }
    console.log(array);
    res.status(200).send({
      array,
      message: "Student particular mentor Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
});

/* GET not assign mentor List */
router.get('/notassign', async function (req, res) {
  try {
    let student = await studentModel.find({}, {});
    let array = [];
    let arr = {

      students: ""
    };
    for (let i in student) {
      let a = student[i].mentors.length;
      if(a==0){
      let students = student[i].name;

      arr = {
        students: students
      }
      array.push(arr);
    }
    }
    console.log(array);
    res.status(200).send({
      array,
      message: "Student Not Assign Mentor!"
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
});



/*create student*/
router.post('/create', async (req, res) => {
  try {
    let student = await studentModel.findOne({ name: req.body.name })
    console.log(student)
    if (!student) {
      let student = await studentModel.create(req.body)
      res.status(201).send({
        message: "Student create Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "Student Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
})

/*Previously assign mentor*/
router.get('/previous/:name', async (req, res) => {
  try {
    let student = await studentModel.findOne({ name: req.params.name })
    let Length = student.mentors.length;
    console.log(Length);
    if ((Length - 1) == 0) {
      let previousMonter = student.mentors[Length - 1];
      console.log(previousMonter)
      if (student) {
        res.status(201).send({
          previousMonter,
          message: "Student get Successfull!"
        })
      }
      else {
        res.status(400).send({ message: "mentor not assign!" })
      }
    } else if ((Length - 1) == -1) {
      res.status(400).send({ message: "Mentor not assign student" });
    } else {
      let previousMonter = student.mentors[Length - 2];
      console.log(previousMonter)
      if (student) {
        res.status(201).send({
          previousMonter,
          message: "Student get Successfull!"
        })
      }
      else {
        res.status(400).send({ message: "mentor not assign!" })
      }
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
})

//Add student name mentor list & mentor name add the student
router.post('/:name', async (req, res) => {
  try {
    let student = await studentModel.findOne({ name: req.params.name })
    let studentList = req.params.name;
    if (student) {
      let mentorlist = req.body.mentors
      let mentorData = await mentorModel.findOne({ name: mentorlist })
      if (mentorData) {
        await studentModel.findOneAndUpdate(
          {
            name: studentList
          },
          {
            $push: { mentors: mentorlist }

          }
        )
        await mentorModel.findOneAndUpdate(
          {
            name: mentorlist
          },
          {
            $push: { students: studentList }
          }
        )
        res.status(200).send({
          message: "Mentor Add Successful!"
        })
      } else {
        res.status(400).send({ message: "Mentor Does Not Exists!" })
      }
    }
    else {
      res.status(400).send({ message: "invalide" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
})

module.exports = router;
