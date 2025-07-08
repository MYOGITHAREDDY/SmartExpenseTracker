//confirm.js
document.addEventListener('DOMContentLoaded', function () {
    const poolData = {
      UserPoolId: 'us-east-1_lvqJN1zz8', // your userpool id
      ClientId: '7p8lkns49ppft7lur3cvnp1uu0' // your app client id
    };
  
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
    document.getElementById('confirmForm').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const code = document.getElementById('code').value;
  
      const userData = {
        Username: email,
        Pool: userPool
      };
  
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.error('Confirmation error:', err);
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log('Confirmation success:', result);
        alert('Account confirmed! You can now login.');
  
        window.location.href = 'index.html'; // send back to login page
      });
    });
  });
  