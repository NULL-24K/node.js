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
/*个人信息*/
function PersionInfo() {
    this.iconUrl;
    this.nickName;
    this.sex;
    this.phoneNum;
    this.emaill;
    this.birthday;
    this.education;
    this.endEducationTime;
    this.workYears;
    this.address;
}


module.exports ={
    userInfo:User,
    test:Name,
    titleModel:workAndEducationModel,
    persionInfo:PersionInfo
}


