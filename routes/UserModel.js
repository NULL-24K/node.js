/**
 * Created by chubin on 2018/4/10.
 */

/*用户信息*/
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
    this.administratorId;
}

function workAndEducationModel() {
   this.title;
   this.detail;
   this.id;
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
    this.email;
    this.birthday;
    this.education;
    this.endEducationTime;
    this.workYears;
    this.address;
}

/*求职意向*/
function JobIntention() {
    /*期望工作地点*/
    this.intentionAddress;
    /*期望行业*/
    this.intentionIndustry;
    /*期望职位*/
    this.intentionPosition;
    /*期望薪资*/
    this.intentionSalary;
    /*求职状态*/
    this.jobState;
}


module.exports ={
    userInfo:User,
    test:Name,
    titleModel:workAndEducationModel,
    persionInfo:PersionInfo,
    jobIntention:JobIntention
}


