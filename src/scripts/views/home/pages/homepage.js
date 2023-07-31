import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const homePage = {
    async render(){
        return `<!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <h1 class="h3 mb-2 text-gray-800">Data Karyawan</h1>
                    <p class="mb-4">Daftar Tabel Dari Data Karyawan Pada Perusahaan UT </p>

                    <!-- DataTales Example -->
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                        <div class="table-title">
                            <div class="row">
                                <div class="col-sm-6">
                                    <h2>Daftar <b>Karyawan</b></h2>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive" style='margin:0;'>
                                <table class="table" id="dataTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                        <th style='max-width:50px;'><input type="checkbox" name="select_all" value="1" id="example-select-all"></th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Jam Lembur</th>
                                            <th>Terakhir Login</th>
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
            <!-- End of Main Content -->`
    },

    async afterRender(){
        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Read All User
        const bodyTable = document.getElementById('bodyTable');
        const initializeData = query(collection(db, "user"), where("role", "==", "karyawan"))
        const userData = await getDocs(initializeData)
        userData.forEach(user => {
            bodyTable.innerHTML += `<tr>
            <td>${user.id}</td>
            <td>${user.data().name}</td>
            <td>${user.data().email}</td>
            <td>${user.data().jam_lembur} Jam</td>
            <td>${user.data().last_login}</td>
        </tr>`
        });

        // Data Tables
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                'columnDefs': [{
                    'targets': 0,
                    'checkboxes': {
                        'selectRow': true
                    },
                 }],
                 retrieve: true,
                 'order': [[1, 'asc']]
            });

            $('#save-btn').on('click',function(){
                let selected_rows = table.column(0).checkboxes.selected()
                let idKaryawan = []
                $.each(selected_rows, function (key, UID) {
                    idKaryawan.push(UID)
                    localStorage.setItem('idKaryawan', idKaryawan)
                })
            })
          });

    }
}
export default homePage;