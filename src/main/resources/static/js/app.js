$(async function () {
    await getTableWithUsers();
    getNewUserForm();
    getDefaultModal();
    addNewUser();
});


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch(`/admin/users`),
    findAllRoles: async () => await fetch(`/api/roles`),
    findUser: async () => await fetch(`/api/user`),
    findOneUser: async (id) => await fetch(`/admin/users/${id}`),
    addNewUser: async (user) => await fetch(`/admin/users`, {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`/admin/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/admin/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            if(users instanceof Array) {
                users.forEach(user => {
                    console.log(user);
                    let array = [];
                    for (let i = 0; i < user.roles.length; i++) {
                        array[i] = user.roles[i].role;
                    }
                    let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password.slice(0, 15)}...</td>
                            <td>${user.age}</td>
                            <td>${array}</td>      
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info eBtn" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-primary delBtn" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                    table.append(tableFilling);
                })
            } else {
                showUser();
            }
        });

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');
        // console.log(buttonUserId);

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })

    $('#newUser').click(function(){
        let defaultModal = $('#someDefaultModal');
        defaultModal.attr('data-action', 'create');
        defaultModal.modal('show');
        return false; });
}


async function getNewUserForm() {
    console.log("getNewUserForm");
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`);

    let role = await userFetchService.findAllRoles();
    let roles = role.json();
    let fullRoleArray = [];
    roles.then( role => {
        role.forEach(rol => {
            fullRoleArray.push(rol.role);
        });
        console.log("fullRoleArray");
        console.log(fullRoleArray);
        createOptions(fullRoleArray);
    });

    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}

function createOptions(fullRoleArray) {
    let select = document.getElementById('AddNewRoles');
    console.log("select");
    console.log(select);
    console.log("fullRoleArray0");
    console.log(fullRoleArray);
    for (let i = 0; i < fullRoleArray.length; i++){
        let opt = document.createElement('option');
        opt.value = fullRoleArray[i];
        opt.innerHTML = fullRoleArray[i];
        select.appendChild(opt);
    }
    console.log("select0");
    console.log(select);
}


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'create':
                createUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    console.log(id);
    let preRoles = await userFetchService.findAllRoles();
    let preuser = await userFetchService.findOneUser(id);
    let roles = preRoles.json();
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);
    let fullRoleArray = [];
    roles.then( role => {
        role.forEach(rol => {
            fullRoleArray.push(rol.role);
        });
        console.log("fullRoleArray");
        console.log(fullRoleArray);
    });

    console.log("preRoles");
    console.log(preRoles);
    user.then(user => {
        let roleArray = [];
        for(let i = 0; i < user.roles.length; i++){
            roleArray[i] = user.roles[i].role;
        }
        let bodyForm = `
            <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <input class="form-control" type="text" id="username" value="${user.username}"><br>
                <input class="form-control" type="password" id="password" value="${user.password}"><br>
                <input class="form-control" id="age" type="number" value="${user.age}"><br>
                <label for="roles">Roles</label>                           
            
        `;
       bodyForm += `
                <select multiple class="form-control" id="roles" name="roles">`;
        console.log("fullRoleArray.length");
        console.log(fullRoleArray.length);
        for (let i=0; i < fullRoleArray.length; i++) {
            bodyForm += `
                <option value="` + fullRoleArray[i];
            if(fullRoleArray.includes(roleArray[i],i)){
                bodyForm +=`" selected="true">`;
            } else {
                bodyForm +=`">`;
            }
            bodyForm +=`` + fullRoleArray[i] + '</option>';
        }
        console.log("fullRoleArray1");
        console.log(fullRoleArray);
        bodyForm += `</select>
                       </form>`;
        modal.find('.modal-body').append(bodyForm);
    });

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let age = modal.find("#age").val().trim();
        let roles = [];
        for (let option of document.getElementById('roles').options) {
            if (option.selected) {
                roles.push(option.value);
            }
        }
        let data = {
            id: id,
            username: username,
            password: password,
            age: age,
            roles: roles
        };
        console.log("data :");
        console.log(data);
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


// получаем пользователя с ролью USER
async function getTableWithRoleUser() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();
    await userFetchService.findUser()
        .then(res => res.json())
        .then(user => {
                console.log(user);
                let array = [];
                for (let i = 0; i < user.roles.length; i++) {
                    array[i] = user.roles[i].role;
                }
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password.slice(0, 15)}...</td>
                            <td>${user.age}</td>
                            <td>${array}</td>      
                        </tr>
                )`;
                table.append(tableFilling);
        });
}


// создаём юзера из модалки создания, отправляем данные
async function createUser(modal, id) {
    console.log("createUser");
    let role = await userFetchService.findAllRoles();
    let roles = role.json();

    let fullRoleArray = [];
    roles.then( role => {
        role.forEach(rol => {
            fullRoleArray.push(rol.role);
        });
        let bodyForm = `
             <form class="form-group" id="editUser">
                 <input class="form-control" type="text" id="username" placeholder="User Name"><br>
                 <input class="form-control" type="password" id="password" placeholder="Password"><br>
                 <input class="form-control" type="text" id="firstName" placeholder="First Name"><br>
                 <input class="form-control" id="age" type="number" placeholder="Age"><br>
                 <label for="roles">Roles</label> `;
            bodyForm += `
                    <select multiple class="form-control" id="roles" name="roles">`;
            console.log("fullRoleArray.length");
            console.log(fullRoleArray.length);
            for (let i=0; i < fullRoleArray.length; i++) {
                bodyForm += `
                <option value="` + fullRoleArray[i];
                bodyForm +=`">`;
                bodyForm +=`` + fullRoleArray[i] + '</option>';
            }
            console.log("fullRoleArray1");
            console.log(fullRoleArray);
            bodyForm += `</select>
                           </form>`;
        modal.find('.modal-body').append(bodyForm);
    });

    modal.find('.modal-title').html('New user');

    let createButton = `<button  class="btn btn-outline-success" id="createButton">Create</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(createButton);
    modal.find('.modal-footer').append(closeButton);


    $("#createButton").on('click', async () => {
        console.log("username");
        console.log(modal.find('#username').val());
        let userName = modal.find('#username').val().trim();
        let firstName = modal.find('#firstName').val().trim();
        let password = modal.find('#password').val().trim();
        let age = modal.find('#age').val().trim();
        let roles = modal.find('#roles').val();

        let data = {
            username: userName,
            firstName: firstName,
            password: password,
            age: age,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.prepend(alert)
        }
    })
}


// удаляем юзера из модалки удаления
async function deleteUser(modal, id) {
    await userFetchService.deleteUser(id);
    getTableWithUsers();
    modal.find('.modal-title').html('');
    modal.find('.modal-body').html('User was deleted');
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
}


async function showUser () {
    console.log("clicked");
    const response = await userFetchService.findUser();

    if (response.ok) {
        getTableWithRoleUser();
        console.log(' show');
    }
}




async function addNewUser() {
    console.log("addNewUser");
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let userName = addUserForm.find('#AddNewUserName').val().trim();
        let firstName = addUserForm.find('#AddNewFirstName').val().trim();
        let password = addUserForm.find('#AddNewUserPassword').val().trim();
        let age = addUserForm.find('#AddNewUserAge').val().trim();
        let roles = addUserForm.find('#AddNewRoles').val();
        let data = {
            username: userName,
            firstName: firstName,
            password: password,
            age: age,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#AddNewUserLogin').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserAge').val('');
            addUserForm.find('#AddNewRoles').val();
            addUserForm.find('#AddNewRoles').val();
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })

}
