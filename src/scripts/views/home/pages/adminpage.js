import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, setDoc, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { nanoid, customAlphabet } from "nanoid";

const adminPage = {
    async render(){
        return `<!-- Begin Page Content -->
        <div class="container-fluid">
            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2>Manajemen <b>Akun</b></h2>
                        </div>
                        <div class="col-sm-6">
                            <a href="#addEmployeeModal" class="btn btn-success" data-toggle="modal"> <span>Tambah Akun Baru</span></a>
                        </div>
                    </div>
                </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive" style='margin:0;'>
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
                    <button class="btn btn-primary" id='save-btn'>Pilih</button>
                </div>
                
            </div>

        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->
        
        
        
        
        
        
        
        
        
        
        

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
        <form id='formEditUser' action="#" method='post'>
            <div class="modal-header">						
                <h4 class="modal-title">Edit Employee</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">					
                <div class="form-group">
                    <label for="nameEdit">Name</label>
                    <input type="text" class="form-control" required id='nameEdit' name='nameEdit'>
                </div>
                <div class="form-group">
                    <label for='emailEdit'>Email</label>
                    <input type="email" class="form-control" required id='emailEdit' name='emailEdit'>
                </div>
                <div class="form-group">
                    <label for='passwordEdit'>Password</label>
                    <input type="password" class="form-control" required id='passwordEdit' name='passwordEdit'>
                </div>
                <div class="form-group">
                <label for='roleEdit'>Role </label>
                            <select class="form-control" id='roleEdit' name='roleEdit'>
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
                <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                <button type="submit" class="btn btn-success" id='btnAdd'>Edit</button>
            </div>
        </form>
    </div>
        </div>
    </div>`
    },

    async afterRender(){
        // Authentication
        const user = localStorage.getItem('user');
        const data = JSON.parse(user)
        if (data.role != 'admin') {
            window.location.href = './'
        }
        
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
            <td style='text-transform: capitalize;'>${user.data().role.replace(/_/g,' ')}</td>
            <td>${user.data().last_login}</td>
            <td>
                <a href="#editEmployeeModal" data-id='${user.id}' class="edit" data-toggle="modal" id='btnEdit'><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                <a href="#" data-id='${user.id}' class="delete" data-toggle="modal" id='btnDelete'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
            </td>
        </tr>`
        });

        // Edit User
        const btnsEdit = document.querySelectorAll('#btnEdit');

        const nameEdit = document.getElementById('nameEdit');
        const emailEdit = document.getElementById('emailEdit');
        const passwordEdit = document.getElementById('passwordEdit');
        const roleEdit = document.getElementById('roleEdit');
        const formEditUser = document.getElementById('formEditUser');

        let idEdit = '';
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                idEdit = btn.getAttribute('data-id');

                const docRef = doc(db, "user", idEdit);
                const userCredentials = await getDoc(docRef);

                nameEdit.value = userCredentials.data().name
                emailEdit.value = userCredentials.data().email
                passwordEdit.value = userCredentials.data().password
                roleEdit.value = userCredentials.data().role
            })    
        });

        
        formEditUser.addEventListener('submit', async (e) => {
            e.preventDefault()
            const data = {
                name: nameEdit.value,
                email: emailEdit.value,
                password: passwordEdit.value,
                role: roleEdit.value,
            }

            try {
                await updateDoc(doc(db, "user", idEdit), data)
                Swal.fire({
                    icon: 'success',
                    title: 'Pengeditan Berhasil',
                    text: 'Selamat akun berhasil anda edit',
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
                    title: 'Pengeditan Gagal',
                    text: error,
                    showCloseButton: true,
                    allowOutsideClick: false
                    })
            }
        })

        // Delete User
        const btnsDelete = document.querySelectorAll('#btnDelete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const dataid = btn.getAttribute('data-id');
                Swal.fire({
                    title: 'Akun ini akan dihapus? ',
                    showCancelButton: true,
                    confirmButtonText: 'Konfirmasi',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await deleteDoc(doc(db, 'user', dataid));
                            Swal.fire({
                                icon: 'success',
                                title: 'Penghapusan Berhasil',
                                text: 'Selamat akun berhasil dihapus',
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
                                title: 'Penghapusan Gagal',
                                text: error,
                                showCloseButton: true,
                                allowOutsideClick: false
                                })
                        }   
                    }
                  });
            })
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
                data.jam_lembur = 7200
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