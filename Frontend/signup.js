//signup.js
document.addEventListener('DOMContentLoaded', function () {
  const poolData = {
    UserPoolId: 'us-east-1_lvqJN1zz8',
    ClientId: '7p8lkns49ppft7lur3cvnp1uu0'
  };
  
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const attributeList = [];
    
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    
    userPool.signUp(email, password, attributeList, null, function (err, result) {
      if (err) {
        console.error(err);
        alert(err.message || JSON.stringify(err));
        return;
      }
      
      console.log('Signup successful:', result);
      alert('Signup successful! Please check your email for the confirmation code.');
      
      window.location.href = 'confirm.html';
    });
  });
});
