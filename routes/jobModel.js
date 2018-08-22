/**
 * Created by tongwenya on 2018/4/11.
 */


function companyModel() {
    this.companyName;
    this.jobName;
    this.companyImgUrl;
    this.workAddress;
    this.minEducation;
    this.workExperienc;
    this.ID;
    this.salary;
    this.administratorId;
    this.time;
}


function jobDetailModel() {
    this.jobName;
    this.jobIncom;
    this.singerLocation;
    this.minEducation;
    this.workExperienc;
    this.applyNum;
    this.wellArr;
    this.interviewTime;
    this.interViewLocation;
    this.jobLocation;
    this.jobDescribe;
    this.applyState;
    this.jobid;
    this.companyName;
    this.statusTag;
    this.tagImgAddress;
    this.openCity;
}

module.exports = {
    companyModel:companyModel,
    jobDetailModel:jobDetailModel
}
