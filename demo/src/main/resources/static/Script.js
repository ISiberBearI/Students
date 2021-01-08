var allGroups;
var currentGroup;
var currentStudent;

function LoadGroup(id){
    $.ajax({
        url: "/group/getbyid/" + id,
        type: "GET"
    }).done((data) =>{
        currentGroup.name = data.name;
        currentGroup.students = data.students;
        UpdateTable(true);
        UpdateSelect(true);
    })
}

function UpdateSelect(selectCurrentGroup = false) {
    let select = "";
    for(let i = 0; i < allGroups.length; i++){
        select += "<option value='" + allGroups[i].id +"'>" + allGroups[i].name + "</option>";
    }
    $("#groupSelect").html(select);
    if(selectCurrentGroup){
        $("#groupSelect").val(currentGroup.id);
    }
    $("#groupSelect").trigger("change");
}

function SelectStudent() {
    if(currentStudent == undefined){
        $("#currentStudentFirstName").prop( "disabled", true );
        $("#currentStudentLastName").prop( "disabled", true );
        $("#currentStudentRating").prop( "disabled", true );
        $("#currentStudentButton").prop( "disabled", true );
    } else {
        $("#currentStudentFirstName").prop( "disabled", false );
        $("#currentStudentLastName").prop( "disabled", false );
        $("#currentStudentRating").prop( "disabled", false );
        $("#currentStudentButton").prop( "disabled", false );
        $("#currentStudentFirstName").val(currentStudent.firstName);
        $("#currentStudentLastName").val(currentStudent.lastName);
        $("#currentStudentRating").val(currentStudent.rating);
    }
}

function SelectGroup() {
    if(currentGroup == undefined){
        $("#currentGroupName").prop( "disabled", true );
        $("#currentGroupButton").prop( "disabled", true );
    } else {
        $("#currentGroupName").prop( "disabled", false );
        $("#currentGroupButton").prop( "disabled", false );
        $("#currentGroupName").val(currentGroup.name);
    }
}

function DeleteStudent(id) {
    $.ajax({
        url: "/student/deletebyid/" + id,
        type: "DELETE"
    }).done((data) =>{
        LoadGroup(currentGroup.id);
    })
}

function DeleteGroup() {
    $.ajax({
        url: "/group/deletebyid/" + currentGroup.id,
        type: "DELETE"
    }).done((data) =>{
        currentGroup = undefined;
        GetAllGroups();
    })
}

function UpdateStudent() {
    let student = {};
    student.id = currentStudent.id;
    student.firstName = $("#currentStudentFirstName").val();
    student.lastName = $("#currentStudentLastName").val();
    student.rating = $("#currentStudentRating").val();
    student.group = currentStudent.group;
    currentStudent = student;
    $.ajax({
        url: "/student/update",
        data: JSON.stringify(student),
        type: "POST",
        contentType: "application/json"
    }).done((data) =>{
        LoadGroup(currentGroup.id);
    })
}

function UpdateGroup() {
    let group = {};
    group.id = currentGroup.id;
    group.name = $("#currentGroupName").val();
    $.ajax({
        url: "/group/update",
        data: JSON.stringify(group),
        type: "POST",
        contentType: "application/json"
    }).done((data) =>{
        LoadGroup(currentGroup.id);
    })
}

function AddStudent() {
    let student = {};
    student.firstName = $("#newStudentFirstName").val();
    student.lastName = $("#newStudentLastName").val();
    student.rating = $("#newStudentRating").val();
    student.group = currentGroup;
    $.ajax({
        url: "/student/create",
        data: JSON.stringify(student),
        type: "POST",
        contentType: "application/json"
    }).done((data) =>{
        LoadGroup(currentGroup.id);
    })
}

function AddGroup() {
    let group = {};
    group.name = $("#newGroupName").val();
    $.ajax({
        url: "/group/create",
        data: JSON.stringify(group),
        type: "POST",
        contentType: "application/json"
    }).done((data) =>{
        GetAllGroups();
    })
}

function UpdateTable(selectCurrentStudent = false) {
    currentStudent = undefined;
    if(currentGroup != undefined ) {
        let tableBody = "";
        for (let i = 0; i < currentGroup.students.length; i++) {
            tableBody += "<tr class='tableRow' id='" + currentGroup.students[i].id + "'>" +
                "<th>" + currentGroup.students[i].lastName + "</th>" +
                "<th>" + currentGroup.students[i].firstName + "</th>" +
                "<th>" + currentGroup.students[i].rating + "</th>" +
                "<th><button class='deleteButton'>X</button></th>" +
                "</tr>";
        }

        $("#tableBody").html(tableBody);

        $(".tableRow > th").unbind("click").bind("click", (e) => {
            let id = $(e.currentTarget.parentElement).attr("id");
            for (let i = 0; i < currentGroup.students.length; i++) {
                if (currentGroup.students[i].id == id) {
                    currentStudent = currentGroup.students[i];
                    SelectStudent();
                    break;
                }
            }
        });
        $(".deleteButton").unbind("click").bind("click", (e) => {
            let id = $(e.currentTarget.parentElement.parentElement).attr("id");
            DeleteStudent(id);
        });

        if (currentStudent != undefined && selectCurrentStudent) {
            for (let i = 0; i < currentGroup.students.length; i++) {
                if (currentGroup.students[i].id == currentStudent.id) {
                    currentStudent = currentGroup.students[i];
                    break;
                }
            }
        } else if (currentGroup.students.length > 0) {
            currentStudent = currentGroup.students[0];
        }
    } else {
        $("#tableBody").html("");
    }
    SelectStudent();
}

function GetAllGroups(){
    $.ajax({
        url: "/group/getall"
    }).done((data) =>{
        allGroups = data;
        UpdateSelect()
    });
}


$(document).ready(() => {
    $("#groupSelect").unbind("change").bind("change", () => {
        let id = $("#groupSelect").val();
        for(let i = 0; i < allGroups.length; i++){
            if(allGroups[i].id == id){
                currentGroup = allGroups[i];
                break;
            }
        }
        UpdateTable();
        SelectGroup();
    });

    $("#groupDelete").unbind("click").bind("click", (e) =>{
        DeleteGroup();
    });

    $("#currentGroupButton").unbind("click").bind("click", (e) =>{
        UpdateGroup();
    });

    $("#newGroupButton").unbind("click").bind("click", (e) =>{
        AddGroup();
    });

    $("#currentStudentButton").unbind("click").bind("click", (e) =>{
        UpdateStudent();
    });

    $("#newStudentButton").unbind("click").bind("click", (e) =>{
        AddStudent();
    });

    GetAllGroups();
});