import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var application = [];

app.post("/api/alumni/register", (req, res) => {
    const newAlum = {
      id: application.length + 1,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      graduationYear: req.body.graduationYear,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      currentJob: req.body.currentJob,
    };
  
    application.push(newAlum);
    console.log(newAlum);
  
    res.status(201).json(newAlum);
  });
  
  app.get("/api/alumni/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const filteredAlumni = application.filter((alumni) => alumni.username === username && alumni.password === password);
    res.json(filteredAlumni);
  });
  
  
app.put("/api/alumni/update/:alumniId", (req, res) => {
  const alumniId = parseInt(req.params.alumniId);
  const existingAlumni = application.find((alumni) => alumni.id === alumniId);

  if (!existingAlumni) {
    return res.status(404).json({ error: `Alumni with id: ${alumniId} not found.` });
  }

  const updatedAlum = {
    id: alumniId,
    username: req.body.username || existingAlumni.username,
    name: req.body.name || existingAlumni.name,
    graduationYear: req.body.graduationYear || existingAlumni.graduationYear,
    contactNumber: req.body.contactNumber || existingAlumni.contactNumber,
    email: req.body.email || existingAlumni.email,
    currentJob: req.body.currentJob || existingAlumni.currentJob,
  };

  const searchIndex = application.findIndex((alumni) => alumni.id === alumniId);
  application[searchIndex] = updatedAlum;
  console.log(updatedAlum);
  res.status(200).json(updatedAlum);
});

app.delete("/api/alumni/delete/:alumniId", (req, res) => {
  const alumniId = parseInt(req.params.alumniId);
  const searchIndex = application.findIndex((alumni) => alumni.id === alumniId);

  if (searchIndex > -1) {
    application.splice(searchIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: `Alumni with id: ${alumniId} not found.` });
  }
});

app.get("/api/alumni/all", (req, res) => {
  if (application.length === 0) {
    console.error("No alumni records found.");
    res.status(404).json({ error: "No alumni records found" });
    return; 
  }
  const alumniProfiles = application.map(({ id, name, graduationYear, currentJob }) => ({
    id,
    name,
    graduationYear,
    currentJob,
  }));

  res.status(200).json(alumniProfiles);
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});