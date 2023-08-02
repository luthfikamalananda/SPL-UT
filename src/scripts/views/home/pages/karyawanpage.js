import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, doc, getDocs, getDoc } from "firebase/firestore";

const karyawanPage = {
    async render(){
        return `<!-- Begin Page Content -->
        <div class="container-fluid">
            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                        <h2>Surat <b>Perintah Lembur</b></h2>
                        </div>
                        <div class="col-sm-6">
                            <a class="btn btn-success" ><span id='menitLembur'>00 MENIT</span></a>
                            <a class="btn btn-success" ><span id='jamLembur'>120 JAM</span></a>
                        </div>
                    </div>
                </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive" style='margin:0;'>
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
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->
        
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
        const daftarKaryawan = document.getElementById('nonAdminPage');
        daftarKaryawan.setAttribute('style', 'display:none;')
        const navBar = document.getElementById('navDashboard');
        navBar.innerText = 'Dashboard'

        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // get Local Storage
        const user = localStorage.getItem('user');
        const data = JSON.parse(user)
        const uid = data.id;

        // get User Data from Database
        const docRef = await getDoc(doc(db, 'user', data.id))
        const userData = docRef.data();

        // Authentication
        if (data.role != 'karyawan') {
            window.location.href = './#/'
        }

        // Get SPL Data
        const bodyTable = document.getElementById('bodyTable');
        const jamLemburContainer = document.getElementById('jamLembur');
        const menitLemburContainer = document.getElementById('menitLembur');
        
        let jamLembur = Math.floor(parseInt(userData.jam_lembur) / 60)
        let menitLembur = parseInt(userData.jam_lembur) % 60

        jamLemburContainer.innerText = `${jamLembur} JAM`;
        menitLemburContainer.innerText = `${menitLembur} MENIT`

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
                    <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                </tr>`
            }
        });

        // Badges Color
        const statusBadges = document.querySelectorAll('#badgeStatus')
        statusBadges.forEach((badge) => {
            if (badge.innerText == 'APPROVED') {
                badge.setAttribute('class', 'badge badge-success')
            } else if (badge.innerText == 'DITOLAK OLEH HCBC') {
                badge.setAttribute('class', 'badge badge-danger')
            } else if (badge.innerText == 'DITOLAK OLEH GM') {
                badge.setAttribute('class', 'badge badge-danger')
            } else if (badge.innerText == 'DITOLAK OLEH DHHC') {
                badge.setAttribute('class', 'badge badge-danger')
            } else {
                badge.setAttribute('class', 'badge badge-primary')
            }
        })

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