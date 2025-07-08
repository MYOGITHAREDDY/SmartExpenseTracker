//login.js
const poolData = {
  UserPoolId: "us-east-1_lvqJN1zz8", // your user pool id here
  ClientId: "7p8lkns49ppft7lur3cvnp1uu0" // your app client id here
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const authenticationData = {
      Username: email,
      Password: password,
  };

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  const userData = {
      Username: email,
      Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log("Login success:", result);
          
          // ✅ Save userEmail in localStorage
          localStorage.setItem('userEmail', email);

          // Navigate to dashboard
          window.location.href = "dashboard.html";
      },
      onFailure: function (err) {
          console.error("Login error:", err);
          document.getElementById("error-message").innerText = err.message || JSON.stringify(err);
      },
  });
});





