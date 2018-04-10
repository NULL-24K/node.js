/**
 * Created by chubin on 2018/4/10.
 */


function User() {
    this.name;
    this.phoneNum;
    this.iconUrl;
    this.sex;
    this.age;
    this.education;
    this.workIntention;
    this.advantage;
    this.workExperienceList;
    this.educationList;
    this.workYears;
}

function workAndEducationModel() {
   this.title;
   this.detail;
}

function Name() {
    this.age;
}


module.exports ={
    userInfo:User,
    test:Name,
    titleModel:workAndEducationModel

}


