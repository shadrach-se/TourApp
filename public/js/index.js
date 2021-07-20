const loginFormLabel = document.querySelector('.form--login');
const logoutFormLabel = document.querySelector('.nav__el--logout');
const updateDataLabel = document.querySelector('.form-user-data');
const updatePassLabel = document.querySelector('.form-user-settings');

const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const updateUserData = async function (data) {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:8080/api/v1/users/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const logout = async function () {
  try {
    const res = await axios.get('http://127.0.0.1:8080/logout');
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    alert(err);
  }
};

const updatePassword = async function (
  oldPassword,
  newPassword,
  newPasswordConfirm
) {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:8080/api/v1/users/updateMyPassword',
      data: {
        oldPassword,
        newPassword,
        newPasswordConfirm,
      },
    });
  } catch (err) {
    alert(err.response.data.message);
  }
};

if (loginFormLabel) {
  loginFormLabel.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (updateDataLabel) {
  updateDataLabel.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateUserData(form);
  });
}
if (logoutFormLabel) {
  logoutFormLabel.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

if (updatePassLabel) {
  updatePassLabel.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save').innerHTML = 'Saving password...';
    const currPass = document.getElementById('password-current').value;
    const newPass = document.getElementById('password').value;
    const confNewPass = document.getElementById('password-confirm').value;
    await updatePassword(currPass, newPass, confNewPass);
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save').innerHTML = 'Save password';
  });
}
