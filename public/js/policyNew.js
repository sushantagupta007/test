const returnPolicy= document.getElementById("returnPolicyHeading");
const termsOfUse = document.getElementById("termsOfUseHeading");
const privacyPolicy = document.getElementById("privacyPolicyHeading");
const returnPolicyDetails= document.getElementById("returnPolicyDetails");
const termsOfUseDetails = document.getElementById("termsOfUseDetails");
const privacyPolicyDetails = document.getElementById("privacyPolicyDetails");
const hrt1 = document.getElementById("hrt1");
const hrt2 = document.getElementById("hrt2");
const hrt3 = document.getElementById("hrt3");


const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('policy');
const cleanAllPolicies = () => {
    returnPolicyDetails.style.display = "none";
    termsOfUseDetails.style.display = "none";
    privacyPolicyDetails.style.display = "none";
    hrt1.style.display = "none";
    hrt2.style.display = "none";
    hrt3.style.display = "none";
}

const showReturnPolicy = () => {
    cleanAllPolicies();
    returnPolicyDetails.style.display = "block";
    hrt1.style.display = "block";
}

const showPrivacyPolicy = () => {
    cleanAllPolicies();
    privacyPolicyDetails.style.display = "block";
    hrt2.style.display = "block";
}

const showTermsOfUse = () => {
    cleanAllPolicies();
    termsOfUseDetails.style.display = "block";
    hrt3.style.display = "block";
}

returnPolicy.addEventListener("click", showReturnPolicy);
privacyPolicy.addEventListener("click", showPrivacyPolicy);
termsOfUse.addEventListener("click", showTermsOfUse);

returnPolicy.addEventListener("touchstart", showReturnPolicy);
privacyPolicy.addEventListener("touchstart", showPrivacyPolicy);
termsOfUse.addEventListener("touchstart", showTermsOfUse);

if(myParam === "returnPolicy"){
    showReturnPolicy();
}
else if(myParam === "privacyPolicy"){
    showPrivacyPolicy();
}
else if(myParam === "termsofuse"){
    showTermsOfUse();
}

