import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { nanoid, customAlphabet } from "nanoid";

const adminPage = {
    async render(){
        return `<div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2>Manage <b>Akun</b></h2>
                        </div>
                        <div class="col-sm-6">
                            <a href="#addEmployeeModal" class="btn btn-success" data-toggle="modal"> <span>Tambah Akun Baru</span></a>
                        </div>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Terakhir Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id='bodyTable'>
                       
                    </tbody>
                </table>
            </div>
        </div>        
    </div>
    <!-- Add Modal HTML -->
    <div id="addEmployeeModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id='formAddUser' action="#" method='post'>
                    <div class="modal-header">						
                        <h4 class="modal-title">Add Employee</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                        <div class="form-group">
                            <label for="nameInput">Name</label>
                            <input type="text" class="form-control" required id='nameInput' name='nameInput'>
                        </div>
                        <div class="form-group">
                            <label for='emailInput'>Email</label>
                            <input type="email" class="form-control" required id='emailInput' name='emailInput'>
                        </div>
                        <div class="form-group">
                            <label for='passwordInput'>Password</label>
                            <input type="password" class="form-control" required id='passwordInput' name='passwordInput'>
                        </div>
                        <div class="form-group">
                        <label for='roleInput'>Role </label>
                                <select class="form-control" id='roleInput' name='roleInput'>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <option value="karyawan"><a class="dropdown-item">Karyawan</a></option>
                                        <option value="departemen_head"><a class="dropdown-item">Departemen Head</a></option>
                                        <option value="hcbc"><a class="dropdown-item">HCBC</a></option>
                                        <option value="general_marketing"><a class="dropdown-item">General Marketing</a></option>
                                        <option value="departement_head_human_capital"><a class="dropdown-item">Departement Head Human Capital</a></option>
                                    </div>
                                </select>
                        </div>					
                    </div>
                    <div class="modal-footer">
                        <input type="button" class="btn btn-default" data-dismiss="modal" value="Batal">
                        <button type="submit" class="btn btn-success" id='btnAdd'>Tambah</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Edit Modal HTML -->
    <div id="editEmployeeModal" class="modal fade">
        <div class="modal-dialog">
        <div class="modal-content">
        <form>
            <div class="modal-header">						
                <h4 class="modal-title">Edit Employee</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">					
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" required>
                </div>
                <div class="form-group">
                <label>Role </label>
                            <select class="form-control">
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <option value="karyawan"><a class="dropdown-item">Karyawan</a></option>
                                    <option value="departemen_head"><a class="dropdown-item">Departemen Head</a></option>
                                    <option value="hcbc"><a class="dropdown-item">HCBC</a></option>
                                    <option value="general_marketing"><a class="dropdown-item">General Marketing</a></option>
                                    <option value="departement_head_human_capital"><a class="dropdown-item">Departement Head Human Capital</a></option>
                                </div>
                            </select>
                        </form>
                    </div>
                </div>					
            </div>
            <div class="modal-footer">
                <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                <input type="submit" class="btn btn-success" value="Edit">
            </div>
        </form>
    </div>
        </div>
    </div>
    <!-- Delete Modal HTML -->
    <div id="deleteEmployeeModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <form>
                    <div class="modal-header">						
                        <h4 class="modal-title">Delete Employee</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                        <p>Are you sure you want to delete these Records?</p>
                        <p class="text-warning"><small>This action cannot be undone.</small></p>
                    </div>
                    <div class="modal-footer">
                        <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                        <input type="submit" class="btn btn-danger" value="Delete">
                    </div>
                </form>
            </div>
        </div>
    </div>`
    },

    async afterRender(){
        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Read All User
        const bodyTable = document.getElementById('bodyTable');
        const initializeData = query(collection(db, "user"), where("role", "!=", "admin"))
        const userData = await getDocs(initializeData)
        userData.forEach(user => {
            console.log(user.id, '=>', user.data());
            bodyTable.innerHTML += `<tr>
            <td>${user.data().name}</td>
            <td>${user.data().email}</td>
            <td style='text-transform: capitalize;'>${user.data().role}</td>
            <td>${user.data().last_login}</td>
            <td>
                <a href="#editEmployeeModal" data-id='${user.id}' class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                <a href="#deleteEmployeeModal" data-id='${user.id}' class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
            </td>
        </tr>`
        });

        // Register
        const name = document.getElementById('nameInput');
        const email = document.getElementById('emailInput');
        const password = document.getElementById('passwordInput');
        const role = document.getElementById('roleInput');
        const formAddUser = document.getElementById('formAddUser');

        formAddUser.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nanoid = customAlphabet('1234567890', 10)
            const data = {
                name: name.value,
                email: email.value,
                password: password.value,
                role: role.value,
                last_login: 'Belum Login'
            }
            if (role.value == 'karyawan') {
                data.jam_lembur = 120
            }
            try {
                await setDoc(doc(db, "user", `${role.value}_${nanoid()}`), data)
                Swal.fire({
                    icon: 'success',
                    title: 'Penambahan Berhasil',
                    text: 'Selamat akun yang anda tambahkan dapat digunakan',
                    showCloseButton: true,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                        location.reload();
                        } 
                    })
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Penambahan Gagal',
                    text: error,
                    showCloseButton: true,
                    allowOutsideClick: false
                    })
            }
        });

        // Data Tables
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                retrieve: true,
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']],
            });
        });
    }
}
export default adminPage;