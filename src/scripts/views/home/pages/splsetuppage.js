import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const splSetupPage = {
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
                            <div class="table-responsive" style='margin:0;overflow-x:hidden;'>
                            <form id='formSetupSPL' action="#" method='post'>
                                    <table class="table" id="dataTablesetup" width="100%" cellspacing="0" >
                                        <thead>
                                            <tr>
                                                <th>ID Karyawan</th>
                                                <th>Name</th>
                                                <th>Waktu Mulai</th>
                                                <th>Waktu Selesai</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody id='bodyTable'>
    
                                        </tbody>
                                    </table>
                                    <button type='submit' class="btn btn-primary" id='save-btn'>Pilih</button>
                            </div>
                            
                            </form>
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
        const dataKaryawan = JSON.parse(localStorage.getItem('idKaryawan'))
        dataKaryawan.forEach(user => {
            bodyTable.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td><input type="datetime-local" data-id="${user.id}" class="form-control" required id='waktuMulaiInput' name='waktuMulaiInput'></td>
                <td><input type="datetime-local" data-id="${user.id}" class="form-control" required id='waktuSelesaiInput' name='waktuSelesaiInput'></td>
                <td><input type="text" data-id="${user.id}" class="form-control" required id='keteranganInput' name='keteranganInput'></td>
            </tr>`
        });

        // Get The Values
        // const formSetupSPL = document.getElementById('formSetupSPL');
        // let processedInput = [];
        // formSetupSPL.addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     const waktuMulaiInput = document.querySelectorAll('#waktuMulaiInput');
        //     waktuMulaiInput.forEach((element) => {
        //         const data = {
                    
        //         }
        //         const userID = element.getAttribute('data-id')
        //         console.log('data-id', userID, 'value', element.value);
        //     })
        // })
        
        const formSetupSPL = document.getElementById('formSetupSPL');
        let processedInput = [];
        formSetupSPL.addEventListener('submit', (e) => {
            e.preventDefault();
            const waktuMulaiInput = document.querySelectorAll('#waktuMulaiInput');
            const waktuSelesaiInput = document.querySelectorAll('#waktuSelesaiInput');
            dataKaryawan.forEach((karyawan) => {
                let waktuMulai;
                let waktuSelesai;
                waktuMulaiInput.forEach((mulai) => {
                    if (mulai.getAttribute('data-id') == karyawan.id) {
                        waktuMulai = mulai.value;
                    }
                })
                waktuSelesaiInput.forEach((selesai) => {
                    if (selesai.getAttribute('data-id') == karyawan.id) {
                        waktuSelesai = selesai.value;
                    }
                })
                let data = {
                    id_karyawan: karyawan.id,
                    waktu_mulai: waktuMulai,
                    waktu_selesai: waktuSelesai,
                }
                console.log('kalkulasi', data);
            })
        })


        // Data Tables
        $(document).ready(function() {
            let table = $('#dataTablesetup').DataTable({
                responsive: true,
                "columns": [
                    { "width": "15%" },
                    { "width": "25%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "40%" },
                  ]
            });
        });

    }
}
export default splSetupPage;