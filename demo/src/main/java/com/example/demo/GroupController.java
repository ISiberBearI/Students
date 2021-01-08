package com.example.demo;

import java.util.List;

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
@RequestMapping("/group")
public class GroupController {
    @Autowired
    private GroupRepository groupRepository;


    @GetMapping("/getall")
    public List<Group> GetAll() {
        return groupRepository.findAll();
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Group> GetById(@PathVariable long id) {
        return ResponseEntity.ok().body(groupRepository.findById(id).get());
    }

    @PostMapping("/update")
    public void Update(@RequestBody Group group) {
        Group groupInDb = groupRepository.findById(group.getId()).get();
        if(groupInDb != null){
            groupInDb.setName(group.getName());
            groupRepository.save(groupInDb);
        }
    }

    @DeleteMapping("/deletebyid/{id}")
    public void DeleteById(@PathVariable long id) {
        groupRepository.deleteById(id);
    }

    @PostMapping("/create")
    public void Create(@RequestBody Group group) {
        groupRepository.save(group);
    }
}
