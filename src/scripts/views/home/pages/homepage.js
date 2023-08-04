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
                                        <th style='max-width:50px;' id='checkboxth'><input type="checkbox" name="select_all" value="1" id="example-select-all"></th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Sisa Durasi Lembur</th>
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
        // Authentication
        const user = localStorage.getItem('user');
        const data = JSON.parse(user)
        if (data.role == 'karyawan') {
            window.location.href = '/#/karyawan'
        } else if(data.role != "departemen_head" && data.role != "admin") {
            const checkBoxes = document.getElementById('checkboxth');
            checkBoxes.setAttribute('style', 'display:none;')
            const btnSave = document.getElementById('save-btn');
            btnSave.setAttribute('style', 'display:none;')
        }

        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Destroy Local Storage
        localStorage.removeItem('idKaryawan')

        // Read All User
        const bodyTable = document.getElementById('bodyTable');
        const initializeData = query(collection(db, "user"), where("role", "==", "karyawan"))
        const userData = await getDocs(initializeData)
        console.log(userData);
        userData.forEach(user => {
            let jamLembur = Math.floor(parseInt(user.data().jam_lembur) / 60)
            let menitLembur = parseInt(user.data().jam_lembur) % 60
            bodyTable.innerHTML += `<tr>
            <td class='checkboxtd'>${user.id}|${user.data().name}</td>
            <td>${user.data().name}</td>
            <td>${user.data().email}</td>
            <td>${jamLembur} Jam ${menitLembur} Menit</td>
            <td>${user.data().last_login}</td>
            </tr>`
            // Authentication
            if (data.role != "departemen_head" && data.role != "admin") {
                const checkBoxTD = document.querySelectorAll('.checkboxtd')
                console.log('cekbok', checkBoxTD);
                checkBoxTD.forEach((e) => {
                    e.setAttribute('style', 'display:none;')
                    console.log(e);
                })
            }
        });

        // Data Tables
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                retrieve: true,
                'columnDefs': [{
                    'targets': 0,
                    'checkboxes': {
                        'selectRow': true
                    },
                 }],
                 'order': [[1, 'asc']]
            });

            $('#save-btn').on('click',function(){
                let selected_rows = table.column(0).checkboxes.selected()
                let idKaryawan = [];
                $.each(selected_rows, function (key, data) {
                    let objectIDKaryawan = {id: data.substring(0, data.indexOf('|')), name: data.substring(data.indexOf('|')+1)}
                    idKaryawan.push(objectIDKaryawan)
                    localStorage.setItem('idKaryawan', JSON.stringify(idKaryawan));
                })
                console.log(idKaryawan);
                window.location.href = '#/splsetup';
            })
          });
    }
}
export default homePage;