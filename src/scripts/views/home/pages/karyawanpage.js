import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";

const karyawanPage = {
    async render(){
        return `<div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2>Surat <b>Perintah Lembur</b></h2>
                        </div>
                        <div class="col-sm-6">
                            <a class="btn btn-success" ><span>00 MENIT</span></a>
                            <a class="btn btn-success" ><span>120 JAM</span></a>
                        </div>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Surat</th>
                            <th>Tanggal Surat</th>
                            <th>Tanggal Lembur</th>
                            <th>Jam Lembur</th>
                            <th>Utusan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id='bodyTable'>
                        
                    </tbody>
                </table>
            </div>
        </div>        
    </div>
    </div>
    </div>
    </div>
    <!-- Delete Modal HTML -->
    <div id="deleteEmployeeModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <form>
                    <div class="modal-header">						
                        <h4 class="modal-title">Delete Perintah Lembur</h4>
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
        // Change Navbar
        const navBar = document.getElementById('navDashboard');
        navBar.innerText = 'Dashboard'

         // get Local Storage
         const user = localStorage.getItem('user');
         const data = JSON.parse(user)
         const uid = data.id;

        // Authentication
        if (data.role != 'karyawan') {
            window.location.href = './#/'
        }

        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Get SPL Data
        const bodyTable = document.getElementById('bodyTable');
        const initializeData = query(collection(db, "spl"))
        const dataSPL = await getDocs(initializeData)
        dataSPL.forEach(element => {
            const spl = element.data().spl
            console.log(spl);
            let foundSPL = spl.find(o => o.id_karyawan === uid);
            let splid = element.id
            
            if (foundSPL) {
                console.log('ketemu', foundSPL);
                bodyTable.innerHTML += `
                <tr>
                    <td>${splid}</td>
                    <td>${spl[0].tanggal_spl_dibuat}</td>
                    <td>${spl[0].tanggal_lembur}</td>
                    <td>${foundSPL.waktu_mulai} - ${foundSPL.waktu_selesai}</td>
                    <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                    <td style='text-transform: capitalize;'><h6><span class="badge badge-danger">${spl[1].status}</span></h6></td>
                </tr>`
            }
            
        });

        // Data Table
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                retrieve: true,
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });
          });
    }
}
export default karyawanPage;