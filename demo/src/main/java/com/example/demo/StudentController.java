package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Student> GetById(@PathVariable long id)  {
        return ResponseEntity.ok().body(studentRepository.findById(id).get());
    }

    @PostMapping("/update")
    public void Update(@RequestBody Student student) {
        Student studentInDb = studentRepository.findById(student.getId()).get();
        if(studentInDb != null){
            studentInDb.setFirstName(student.getFirstName());
            studentInDb.setLastName(student.getLastName());
            if(student.getGroup() != null){
                studentInDb.setGroup(student.getGroup());
            }
            studentInDb.setRating(student.getRating());
            studentRepository.save(studentInDb);
        }
    }

    @DeleteMapping("/deletebyid/{id}")
    public void DeleteById(@PathVariable long id) {
        studentRepository.deleteById(id);
    }

    @PostMapping("/create")
    public void Create(@RequestBody Student student) {
        studentRepository.save(student);
    }
}
