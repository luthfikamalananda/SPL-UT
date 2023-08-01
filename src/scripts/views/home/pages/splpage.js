import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, deleteDoc, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const splPage = {
    async render(){
        return `<div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <h2 id='table1Title'><b>Surat Perintah Lembur Keputusan Anda</b></h2>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable1" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Surat</th>
                            <th>Tanggal Surat</th>
                            <th>Tanggal Lembur</th>
                            <th>Departemen Head</th>
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
                        <h2 id='table2Title'><b>Seluruh Surat Perintah Lembur</b></h2>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable2" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Surat</th>
                            <th>Tanggal Surat</th>
                            <th>Tanggal Lembur</th>
                            <th>Departemen Head</th>
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
    </div>`
    },

    async afterRender(){
        //  get Local Storage
        const user = localStorage.getItem('user');
        const data = JSON.parse(user)

        // Initialize Database
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Authentication
        let findStatus = 'diajukan_ke_hcbc'
        if (data.role == 'departemen_head' || data.role == 'admin') { // ------------------ Departemen Head ------------------ 
            // Get Private SPL Data (First Table)
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
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger">${spl[1].status.replace(/_/g,' ')}</span></h6></td>
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
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger">${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                    </tr>`
                }
            });

        } else if (data.role == 'hcbc') { // ------------------ HCBC ------------------ 
            findStatus = 'diajukan_ke_hcbc'
            // Get SPL Data (Based on Status)
            const Table_1_Title = document.getElementById('table1Title');
            Table_1_Title.innerHTML = '<b>Surat Perintah Lembur yang Butuh Persetujuan</b>'
            const tablePrivate = document.getElementById('dataTable1');
            tablePrivate.innerHTML = `
            <thead>
                <tr>
                <th>ID Surat</th>
                <th>Tanggal Surat</th>
                <th>Tanggal Lembur</th>
                <th>Departemen Head</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody id='bodyTablePrivate'></tbody>
            `
            const bodyTablePrivate = document.getElementById('bodyTablePrivate');
            const initializeData = query(collection(db, "spl"))
            const dataSPL = await getDocs(initializeData)
            dataSPL.forEach(element => {
                const spl = element.data().spl
                console.log(spl);
                let foundSPL = spl.find(o => o.status === findStatus);
                console.log(foundSPL);
                let splid = element.id

                if (foundSPL) {
                    bodyTablePrivate.innerHTML += `
                    <tr>
                        <td>${splid}</td>
                        <td>${spl[0].tanggal_spl_dibuat}</td>
                        <td>${spl[0].tanggal_lembur}</td>
                        <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger">${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnApprove' style='color:#2fcd2c;'><i class="material-icons" data-toggle="tooltip" title="Approve">check_circle</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnReject'><i class="material-icons" data-toggle="tooltip" title="Reject">close</i></a>
                        </td>
                    </tr>`
                }
            });

            // Approve Button
            const btnsApprove = document.querySelectorAll('#btnApprove');
            btnsApprove.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const dataid = btn.getAttribute('data-id');

                    const docSnap = await getDoc(doc(db, 'spl', dataid))
                    const objSPL = docSnap.data().spl;
                    console.log(objSPL);
                    objSPL[1].hcbc = `${data.id}|${data.name}` // Add HCBC in index 1
                    objSPL[1].status = 'diajukan_ke_gm' // Add Status in index 1

                    Swal.fire({
                        title: 'SPL ini akan Anda Approve? ',
                        showCancelButton: true,
                        confirmButtonText: 'Konfirmasi',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                await setDoc(doc(db, 'spl', dataid), {
                                    spl:objSPL
                                });
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Approve Berhasil',
                                    text: 'Selamat SPL berhasil anda Approve',
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
                                    title: 'Approve Gagal',
                                    text: error,
                                    showCloseButton: true,
                                    allowOutsideClick: false
                                    })
                            }   
                        }
                    });
                })
            });
            //--------------------------------- REJECT BUTTON ----------------------------------

            // Get Private SPL Data (Self-Made by Account)
            const Table_2_Title = document.getElementById('table2Title');
            Table_2_Title.innerHTML = '<b>Surat Perintah Lembur Persetujuan Anda</b>'
            const tablePublic = document.getElementById('dataTable2');
            tablePublic.innerHTML = `
            <thead>
                <tr>
                <th>ID Surat</th>
                <th>Tanggal Surat</th>
                <th>Tanggal Lembur</th>
                <th>Departemen Head</th>
                <th>HCBC</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody id='bodyTable'></tbody>
            `
            const bodyTable = document.getElementById('bodyTable');
            dataSPL.forEach(element => {
                const spl = element.data().spl
                console.log(spl);
                let foundSPL = spl.find(o => o.hcbc === `${data.id}|${data.name}`);
                console.log(foundSPL);
                let splid = element.id

                if (foundSPL) {
                    bodyTable.innerHTML += `
                    <tr>
                        <td>${splid}</td>
                        <td>${spl[0].tanggal_spl_dibuat}</td>
                        <td>${spl[0].tanggal_lembur}</td>
                        <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                        <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger">${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnRestore'><i class="material-icons" data-toggle="tooltip" title="Restore">restore</i></a>
                        </td>
                    </tr>`
                }
            });

            // Undo Button
            const btnsRestore = document.querySelectorAll('#btnRestore');
            btnsRestore.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const dataid = btn.getAttribute('data-id');

                    const docSnap = await getDoc(doc(db, 'spl', dataid))
                    const objSPL = docSnap.data().spl;
                    console.log(objSPL);
                    delete objSPL[1].hcbc // Remove HCBC in index 1
                    objSPL[1].status = 'diajukan_ke_hcbc' // Restore Status in index 1

                    Swal.fire({
                        title: 'Anda yakin ingin mengembalikan status SPL ini?',
                        showCancelButton: true,
                        confirmButtonText: 'Konfirmasi',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                await setDoc(doc(db, 'spl', dataid), {
                                    spl:objSPL
                                });
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Pengembalian Berhasil',
                                    text: 'SPL dapat anda approve/reject lagi',
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
                                    title: 'Pengembalian Gagal',
                                    text: error,
                                    showCloseButton: true,
                                    allowOutsideClick: false
                                    })
                            }   
                        }
                    });
                })
            });

            
        } else if(data.role == 'general_marketing') {
            findStatus = 'approved_hcbc'
        }

        

        // Data Table
        $(document).ready(function() {
            let tablePrivate = $('#dataTable1').DataTable({
                retrieve: true,
                lengthMenu: [5, 10, 20, 50, 100, 200, 500],
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });

            let table = $('#dataTable2').DataTable({
                retrieve: true,
                lengthMenu: [5, 10, 20, 50, 100, 200, 500],
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });
          });

        // Delete Button
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