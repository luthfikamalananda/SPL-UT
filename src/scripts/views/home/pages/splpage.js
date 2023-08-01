import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const splPage = {
    async render(){
        return `<div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2><b>Surat Perintah Lembur Keputusan Anda</b></h2>
                        </div>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTablePrivate" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Surat</th>
                            <th>Tanggal Surat</th>
                            <th>Tanggal Lembur</th>
                            <th>Utusan</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id='bodyTablePrivate'>
                        
                    </tbody>
                </table>
            </div>
        </div>        
    </div>
    </div>
    </div>
    </div>

    <div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2><b>Seluruh Perintah Lembur</b></h2>
                        </div>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Surat</th>
                            <th>Tanggal Surat</th>
                            <th>Tanggal Lembur</th>
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
        //  get Local Storage
        const user = localStorage.getItem('user');
        const data = JSON.parse(user)

        // Authentication
        let findStatus = 'diajukan'
        if (data.role == 'hcbc') {
            findStatus = 'diajukan'
        } else if(data.role == 'general_marketing') {
            findStatus = 'approved_hcbc'
        }

        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Get Private SPL Data (Self-Made by Account)
        const bodyTablePrivate = document.getElementById('bodyTablePrivate');
        const initializeData = query(collection(db, "spl"))
        const dataSPL = await getDocs(initializeData)
        dataSPL.forEach(element => {
            const spl = element.data().spl
            console.log(spl);
            let foundSPL = spl.find(o => o.departemen_head === `${data.id}|${data.name}`);
            console.log(foundSPL);
            let splid = element.id

            if (foundSPL) {
                bodyTablePrivate.innerHTML += `
                <tr>
                    <td>${splid}</td>
                    <td>${spl[0].tanggal_spl_dibuat}</td>
                    <td>${spl[0].tanggal_lembur}</td>
                    <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                    <td style='text-transform: capitalize;'><h6><span class="badge badge-danger">${spl[1].status}</span></h6></td>
                    <td>
                        <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnDelete'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`
            }
        });

        // Get SPL Data (Based on Status)
        const bodyTable = document.getElementById('bodyTable');
        dataSPL.forEach(element => {
            const spl = element.data().spl
            console.log(spl);
            let foundSPL = spl.find(o => o.status === findStatus);
            console.log(foundSPL);
            let splid = element.id

            if (foundSPL) {
                bodyTable.innerHTML += `
                <tr>
                    <td>${splid}</td>
                    <td>${spl[0].tanggal_spl_dibuat}</td>
                    <td>${spl[0].tanggal_lembur}</td>
                    <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                    <td style='text-transform: capitalize;'><h6><span class="badge badge-danger">${spl[1].status}</span></h6></td>
                </tr>`
            }
        });

        // Data Table
        $(document).ready(function() {
            let tablePrivate = $('#dataTablePrivate').DataTable({
                retrieve: true,
                lengthMenu: [5, 10, 20, 50, 100, 200, 500],
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });

            let table = $('#dataTable').DataTable({
                retrieve: true,
                lengthMenu: [5, 10, 20, 50, 100, 200, 500],
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });
          });

        // Delete User
        const btnsDelete = document.querySelectorAll('#btnDelete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const dataid = btn.getAttribute('data-id');
                Swal.fire({
                    title: 'SPL ini akan dihapus? ',
                    showCancelButton: true,
                    confirmButtonText: 'Konfirmasi',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await deleteDoc(doc(db, 'spl', dataid));
                            Swal.fire({
                                icon: 'success',
                                title: 'Penghapusan Berhasil',
                                text: 'Selamat SPL berhasil dihapus',
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
    }
}
export default splPage;