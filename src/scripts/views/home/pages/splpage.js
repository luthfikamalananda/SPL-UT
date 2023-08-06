import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, deleteDoc, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const splPage = {
    async render(){
        return `<!-- Begin Page Content -->
        <div class="container-fluid">
            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2 id='table1Title'><b>Surat Perintah Lembur Keputusan Anda</b></h2>
                        </div>
                    </div>
                </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive" style='margin:0;'>
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
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->
        
        
        
        
        
        
        
        
    <!-- Begin Page Content -->
        <div class="container-fluid">
            <!-- DataTales Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2 id='table2Title'><b>Seluruh Surat Perintah Lembur</b></h2>
                        </div>
                    </div>
                </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive" style='margin:0;'>
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
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->










    <div id="rejectModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id='formReject' action="#" method='post'>
                    <div class="modal-header">						
                        <h4 class="modal-title">Alasan Penolakan SPL</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                        <div class="form-group">
                            <label for="reasonInput">Masukkan Alasan : </label>
                            <textarea class="form-control" required id='reasonInput' name='reasonInput' rows="4" cols="50"></textarea>
                        </div>	
                    </div>
                    <div class="modal-footer">
                        <input type="button" class="btn btn-default" data-dismiss="modal" value="Batal">
                        <button type="submit" class="btn btn-danger" id='btnRejectSubmit'>Reject</button>
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
                let foundSPL = spl.find(o => o.departemen_head === `${data.id}|${data.name}`);
                let splid = element.id
                if (foundSPL) {
                    console.log(spl[1].status);
                    bodyTablePrivate.innerHTML += `
                    <tr>
                        <td>${splid}</td>
                        <td>${spl[0].tanggal_spl_dibuat}</td>
                        <td>${spl[0].tanggal_lembur}</td>
                        <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnDelete' style='display:none;'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                        </td>
                    </tr>`

                    if (spl[1].status == findStatus) {
                        const btnDelete = document.getElementById('btnDelete')
                        btnDelete.setAttribute('style', 'display:inline-block;')
                    } 
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
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6> <a href="#rejectModal" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a></td>
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
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnApprove' style='color:#2fcd2c;'><i class="material-icons" data-toggle="tooltip" title="Approve">check_circle</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                            <a href="#rejectModal" data-id='${splid}' class="delete" data-toggle="modal" id='btnReject'><i class="material-icons" data-toggle="tooltip" title="Reject">close</i></a>
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
            let idSPLtoEdit = ''
            const btnsReject = document.querySelectorAll('#btnReject');
            btnsReject.forEach((btn) => {
                idSPLtoEdit = btn.getAttribute('data-id');
            })

            const formReject = document.getElementById('formReject');
            const reasonInput = document.getElementById('reasonInput');
            formReject.addEventListener('submit', async (e) => {
                e.preventDefault();

                const docSnap = await getDoc(doc(db, 'spl', idSPLtoEdit))
                const objSPL = docSnap.data().spl;
                console.log(objSPL);
                objSPL[1].hcbc = `${data.id}|${data.name}` // Add HCBC in index 1
                objSPL[1].status = 'ditolak_oleh_hcbc' // Add Status rejected in index 1
                objSPL[1].reject_reason = reasonInput.value; // Add reasoning in index 1

                try {
                    await setDoc(doc(db, 'spl', idSPLtoEdit), {
                        spl:objSPL
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Penolakan Berhasil',
                        text: 'SPL berhasil anda Tolak (Reject)',
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
                        title: 'Penolakan Gagal',
                        text: error,
                        showCloseButton: true,
                        allowOutsideClick: false
                    })
                }
            } )

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
                let foundSPL = spl.find(o => o.hcbc === `${data.id}|${data.name}`);
                let splid = element.id

                if (foundSPL) {
                    if (spl[1].status == 'diajukan_ke_gm' || spl[1].status == 'ditolak_oleh_hcbc') {
                        bodyTable.innerHTML += `
                        <tr>
                        <td>${splid}</td>
                        <td>${spl[0].tanggal_spl_dibuat}</td>
                        <td>${spl[0].tanggal_lembur}</td>
                        <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                        <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnRestore'><i class="material-icons" data-toggle="tooltip" title="Restore">restore</i></a>
                        </td>
                    </tr>`;
                    } else {
                        bodyTable.innerHTML += `
                        <tr>
                        <td>${splid}</td>
                        <td>${spl[0].tanggal_spl_dibuat}</td>
                        <td>${spl[0].tanggal_lembur}</td>
                        <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                        <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                        </td>
                    </tr>`;
                    }
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
                    delete objSPL[1].reject_reason // Remove reject_reason in index 1
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

            
        } else if(data.role == 'general_marketing') { // ----------------------- GENERAL MARKETING -----------------------
            findStatus = 'diajukan_ke_gm'
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
                <th>HCBC</th>
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
                        <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnApprove' style='color:#2fcd2c;'><i class="material-icons" data-toggle="tooltip" title="Approve">check_circle</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                            <a href="#rejectModal" data-id='${splid}' class="delete" data-toggle="modal" id='btnReject'><i class="material-icons" data-toggle="tooltip" title="Reject">close</i></a>
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
                    objSPL[1].general_marketing = `${data.id}|${data.name}` // Add GM in index 1
                    objSPL[1].status = 'diajukan_ke_dhhc' // Add Status in index 1

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
            let idSPLtoEdit = ''
            const btnsReject = document.querySelectorAll('#btnReject');
            btnsReject.forEach((btn) => {
                idSPLtoEdit = btn.getAttribute('data-id');
            })

            const formReject = document.getElementById('formReject');
            const reasonInput = document.getElementById('reasonInput');
            formReject.addEventListener('submit', async (e) => {
                e.preventDefault();

                const docSnap = await getDoc(doc(db, 'spl', idSPLtoEdit))
                const objSPL = docSnap.data().spl;
                console.log(objSPL);
                objSPL[1].general_marketing = `${data.id}|${data.name}` // Add HCBC in index 1
                objSPL[1].status = 'ditolak_oleh_gm' // Add Status rejected in index 1
                objSPL[1].reject_reason = reasonInput.value; // Add reasoning in index 1

                try {
                    await setDoc(doc(db, 'spl', idSPLtoEdit), {
                        spl:objSPL
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Penolakan Berhasil',
                        text: 'SPL berhasil anda Tolak (Reject)',
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
                        title: 'Penolakan Gagal',
                        text: error,
                        showCloseButton: true,
                        allowOutsideClick: false
                    })
                }
            } )

            // TABLE 2 ---- Get Private SPL Data (Self-Made by Account)
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
                <th>General Marketing</th>
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
                let foundSPL = spl.find(o => o.general_marketing === `${data.id}|${data.name}`);
                console.log(foundSPL);
                let splid = element.id

                if (foundSPL) {
                    if (spl[1].status == 'diajukan_ke_dhhc' || spl[1].status == 'ditolak_oleh_gm') {
                        bodyTable.innerHTML += `
                        <tr>
                            <td>${splid}</td>
                            <td>${spl[0].tanggal_spl_dibuat}</td>
                            <td>${spl[0].tanggal_lembur}</td>
                            <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                            <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                            <td>${spl[1].general_marketing.substring(spl[1].general_marketing.indexOf('|')+1)}</td>
                            <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                            <td>
                                <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                                <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnRestore'><i class="material-icons" data-toggle="tooltip" title="Restore">restore</i></a>
                            </td>
                        </tr>`
                    } else {
                        bodyTable.innerHTML += `
                        <tr>
                            <td>${splid}</td>
                            <td>${spl[0].tanggal_spl_dibuat}</td>
                            <td>${spl[0].tanggal_lembur}</td>
                            <td>${spl[1].departemen_head.substring(spl[1].departemen_head.indexOf('|')+1)}</td>
                            <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                            <td>${spl[1].general_marketing.substring(spl[1].general_marketing.indexOf('|')+1)}</td>
                            <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                            <td>
                                <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                            </td>
                        </tr>`
                    }
                   
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
                    delete objSPL[1].general_marketing // Remove HCBC in index 1
                    delete objSPL[1].reject_reason // Remove reject_reason in index 1
                    objSPL[1].status = 'diajukan_ke_gm' // Restore Status in index 1

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
        } else if(data.role == 'departement_head_human_capital') { // ----------------------- DEPARTMENT HEAD HUMAN CAPITAL -----------------------
            findStatus = 'diajukan_ke_dhhc'
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
                <th>HCBC</th>
                <th>General Marketing</th>
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
                        <td>${spl[1].hcbc.substring(spl[1].hcbc.indexOf('|')+1)}</td>
                        <td>${spl[1].general_marketing.substring(spl[1].general_marketing.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnApprove' style='color:#2fcd2c;'><i class="material-icons" data-toggle="tooltip" title="Approve">check_circle</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                            <a href="#rejectModal" data-id='${splid}' class="delete" data-toggle="modal" id='btnReject'><i class="material-icons" data-toggle="tooltip" title="Reject">close</i></a>
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
                    objSPL[1].departement_head_human_capital = `${data.id}|${data.name}` // Add GM in index 1
                    objSPL[1].status = 'approved' // Add Status in index 1

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

                                // Kalkulasi Jam Lembur + Mengubah Jam Lembur pada Karyawan
                                objSPL.forEach(async (element, index) => {
                                    if (index >= 2) {
                                        let waktuMulai = element.waktu_mulai.split(':')
                                        let waktuMulai_ToMenit = (parseInt(waktuMulai[0]) * 60) + (parseInt(waktuMulai[1]))
                                        console.log(waktuMulai_ToMenit);
            
                                        let waktuSelesai = element.waktu_selesai.split(':')
                                        let waktuSelesai_ToMenit = (parseInt(waktuSelesai[0]) * 60) + (parseInt(waktuSelesai[1]))
                                        console.log(waktuSelesai_ToMenit);
            
                                        let durasiLembur_Menit = Math.abs(waktuSelesai_ToMenit - waktuMulai_ToMenit)
                                        console.log(durasiLembur_Menit);
            
                                        const docRef = await getDoc(doc(db, 'user', element.id_karyawan))
                                        const dataKaryawan = docRef.data();
            
                                        await updateDoc(doc(db, 'user', element.id_karyawan), {
                                            jam_lembur: parseInt(dataKaryawan.jam_lembur) - durasiLembur_Menit
                                        });
                                    }
                                })

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
            let idSPLtoEdit = ''
            const btnsReject = document.querySelectorAll('#btnReject');
            btnsReject.forEach((btn) => {
                idSPLtoEdit = btn.getAttribute('data-id');
            })

            const formReject = document.getElementById('formReject');
            const reasonInput = document.getElementById('reasonInput');
            formReject.addEventListener('submit', async (e) => {
                e.preventDefault();

                const docSnap = await getDoc(doc(db, 'spl', idSPLtoEdit))
                const objSPL = docSnap.data().spl;
                console.log(objSPL);
                objSPL[1].departement_head_human_capital = `${data.id}|${data.name}` // Add HCBC in index 1
                objSPL[1].status = 'ditolak_oleh_dhhc' // Add Status rejected in index 1
                objSPL[1].reject_reason = reasonInput.value; // Add reasoning in index 1

                try {
                    await setDoc(doc(db, 'spl', idSPLtoEdit), {
                        spl:objSPL
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Penolakan Berhasil',
                        text: 'SPL berhasil anda Tolak (Reject)',
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
                        title: 'Penolakan Gagal',
                        text: error,
                        showCloseButton: true,
                        allowOutsideClick: false
                    })
                }
            } )

            // TABLE 2 ---- Get Private SPL Data (Self-Made by Account)
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
                <th>General Marketing</th>
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
                let foundSPL = spl.find(o => o.departement_head_human_capital === `${data.id}|${data.name}`);
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
                        <td>${spl[1].general_marketing.substring(spl[1].general_marketing.indexOf('|')+1)}</td>
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
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
                    delete objSPL[1].departement_head_human_capital
                    delete objSPL[1].reject_reason // Remove reject_reason in index 1

                    Swal.fire({
                        title: 'Anda yakin ingin mengembalikan status SPL ini?',
                        showCancelButton: true,
                        confirmButtonText: 'Konfirmasi',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                if (objSPL[1].status == 'approved') {
                                    // Kalkulasi Jam Lembur + Mengubah Jam Lembur pada Karyawan
                                    objSPL.forEach(async (element, index) => {
                                        if (index >= 2) {
                                            let waktuMulai = element.waktu_mulai.split(':')
                                            let waktuMulai_ToMenit = (parseInt(waktuMulai[0]) * 60) + (parseInt(waktuMulai[1]))
                                            console.log(waktuMulai_ToMenit);
                
                                            let waktuSelesai = element.waktu_selesai.split(':')
                                            let waktuSelesai_ToMenit = (parseInt(waktuSelesai[0]) * 60) + (parseInt(waktuSelesai[1]))
                                            console.log(waktuSelesai_ToMenit);
                
                                            let durasiLembur_Menit = Math.abs(waktuSelesai_ToMenit - waktuMulai_ToMenit)
                                            console.log(durasiLembur_Menit);
                
                                            const docRef = await getDoc(doc(db, 'user', element.id_karyawan))
                                            const dataKaryawan = docRef.data();
                
                                            await updateDoc(doc(db, 'user', element.id_karyawan), {
                                                jam_lembur: parseInt(dataKaryawan.jam_lembur) + durasiLembur_Menit
                                            });
                                        }
                                    })
                                }

                                objSPL[1].status = 'diajukan_ke_dhhc' // Restore Status in index 1
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
        } else if (data.role == 'karyawan'){
            window.location.href = './'
        }

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
        
        // MAKE PDF (PRINTBTN)
        const btnsPrint = document.querySelectorAll('#btnPrint');
        btnsPrint.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const dataid = btn.getAttribute('data-id');
                pdfMake.vfs = pdfFonts.pdfMake.vfs;

                const docRef = await getDoc(doc(db, 'spl', dataid));
                const DataSPL = docRef.data().spl;

                let karyawanData = [[{text: 'No', alignment: 'center', bold: true}, {text: 'Nama', alignment: 'center', bold: true}, {text: 'ID', alignment: 'center', bold: true}, {text: 'Waktu Mulai', alignment: 'center', bold: true}, {text: 'Waktu Selesai', alignment: 'center', bold: true}, {text: 'Keterangan', alignment: 'center', bold: true}]]
                let counter = 1;

                // Add new Variables for Karyawan Data to PDF
                DataSPL.forEach(async (element, index) => {
                    if (index >= 2) {
                        let nomor = {
                            text: counter,
                            alignment: 'center'
                        }
                        let nama = {
                            text: element.name,
                            alignment: 'center'
                        }
                        let id = {
                            text: element.id_karyawan,
                            alignment: 'center'
                        }
                        let waktu_mulai = {
                            text: element.waktu_mulai,
                            alignment: 'center'
                        }
                        let waktu_selesai = {
                            text: element.waktu_selesai,
                            alignment: 'center'
                        }
                        let keterangan = {
                            text: element.keterangan,
                            alignment: 'center'
                        }
                        let newvar = [nomor,nama,id,waktu_mulai,waktu_selesai,keterangan]
                        karyawanData.push(newvar);
                        console.log('newar', newvar);
                        console.log('kardat', karyawanData);
                    }
                })
                
                // Add New Variables for The Atasan Data
                let atasanData = [[{text: 'No', alignment: 'center', bold: true}, {text: 'Nama', alignment: 'center', bold: true}, {text: 'ID', alignment: 'center', bold: true}, {text: 'Jabatan', alignment: 'center', bold: true}]]
                atasanData.push(
                    [{text:'1', alignment: 'center'}, {text:DataSPL[1].departemen_head.substring(DataSPL[1].departemen_head.indexOf('|')+1), alignment: 'center'}, {text:DataSPL[1].departemen_head.substring(0, DataSPL[1].departemen_head.indexOf('|')), alignment: 'center'}, {text:DataSPL[1].departemen_head.substring(0, DataSPL[1].departemen_head.indexOf('|')).slice(0, -11).replace(/_/g,' ').toUpperCase(), alignment: 'center'}]
                )

                if (DataSPL[1].hcbc) {
                    atasanData.push(
                        [{text:'2', alignment: 'center'}, {text:DataSPL[1].hcbc.substring(DataSPL[1].hcbc.indexOf('|')+1), alignment: 'center'}, {text:DataSPL[1].hcbc.substring(0, DataSPL[1].hcbc.indexOf('|')), alignment: 'center'}, {text:DataSPL[1].hcbc.substring(0, DataSPL[1].hcbc.indexOf('|')).slice(0, -11).replace(/_/g,' ').toUpperCase(), alignment: 'center'}]
                    )
                    if (DataSPL[1].general_marketing) {
                        atasanData.push(
                            [{text:'3', alignment: 'center'}, {text:DataSPL[1].general_marketing.substring(DataSPL[1].general_marketing.indexOf('|')+1), alignment: 'center'}, {text:DataSPL[1].general_marketing.substring(0, DataSPL[1].general_marketing.indexOf('|')), alignment: 'center'}, {text:DataSPL[1].general_marketing.substring(0, DataSPL[1].general_marketing.indexOf('|')).slice(0, -11).replace(/_/g,' ').toUpperCase(), alignment: 'center'}]
                        )
                        if (DataSPL[1].departement_head_human_capital) {
                            atasanData.push(
                                [{text:'4', alignment: 'center'}, {text:DataSPL[1].departement_head_human_capital.substring(DataSPL[1].departement_head_human_capital.indexOf('|')+1), alignment: 'center'}, {text:DataSPL[1].departement_head_human_capital.substring(0, DataSPL[1].departement_head_human_capital.indexOf('|')), alignment: 'center'}, {text:DataSPL[1].departement_head_human_capital.substring(0, DataSPL[1].departement_head_human_capital.indexOf('|')).slice(0, -11).replace(/_/g,' ').toUpperCase(), alignment: 'center'}]
                            )
                        }
                    }
                }

                let signatureAtasan = [];
                let containerArrName = []
                let hitungan = 1
                // Signature Name
                containerArrName.push(
                    {text:DataSPL[1].departemen_head.substring(DataSPL[1].departemen_head.indexOf('|')+1)}
                )
                if (DataSPL[1].hcbc) {
                    hitungan++;
                    containerArrName.push(
                        {text:DataSPL[1].hcbc.substring(DataSPL[1].hcbc.indexOf('|')+1)}
                    )
                    if (DataSPL[1].general_marketing) {
                        hitungan++;
                        containerArrName.push(
                            {text:DataSPL[1].general_marketing.substring(DataSPL[1].general_marketing.indexOf('|')+1)}
                        )
                        if (DataSPL[1].departement_head_human_capital) {
                            hitungan++;
                            containerArrName.push(
                                {text:DataSPL[1].departement_head_human_capital.substring(DataSPL[1].departement_head_human_capital.indexOf('|')+1)}
                            )
                        }
                    }
                }

                // Signature Image
                let containerArrSignature = []
                for (let i = 0; i < hitungan; i++) {
                    containerArrSignature.unshift({image:'data:image/png;base64,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',width:50})
                }

                signatureAtasan.push(containerArrSignature, containerArrName)
                console.log(signatureAtasan);

                var docDefinition = {
                    pageOrientation: 'landscape',
                    info: {
                        title: dataid,
                    },
                    watermark: { text: 'UNITED TRACTORS', angle: 65, opacity: 0.1, bold: true, italics: false, fontSize: 80 },
                    content: [
                        {
                            text: ['UNITED TRACTORS'],
                            style: 'header',
                            alignment: 'center',
                            fontSize: 16
                        },
                        {
                            text: ['FORMULIR SURAT PERINTAH LEMBUR'],
                            style: 'header',
                            alignment: 'center',
                            margin: [0, 0, 0, 20],
                        },
                        {
                            columns: [
                                {
                                    text: `Nomor`,
                                    width: 120,
                                },
                                {
                                    text: `:`,
                                    width: 20,
                                },
                                {
                                    text: `${dataid}`,
                                    width: 'auto',
                                }
                            ],
                            style: 'content',
                            bold: false
                        },
                        {
                            columns: [
                                {
                                    text: `Tanggal Pengajuan`,
                                    width: 120,
                                },
                                {
                                    text: `:`,
                                    width: 20,
                                },
                                {
                                    text: `${DataSPL[0].tanggal_spl_dibuat}`,
                                    width: 'auto',
                                }
                            ],
                            margin: [0, 2, 0, 0]
                        },
                        {
                            columns: [
                                {
                                    text: `Tanggal Pelaksanaan`,
                                    width: 120,
                                },
                                {
                                    text: `:`,
                                    width: 20,
                                },
                                {
                                    text: `${DataSPL[0].tanggal_lembur}`,
                                    width: 'auto',
                                }
                            ],
                            margin: [0, 2, 0, 0]
                        },
                        {
                            text: 'Data Karyawan', style: 'subheader'
                        },
                        {
                            margin: [0, 5, 0, 5],
                            table: {
                                widths: [30, '*', '*', '*', 'auto', '*'],
                                body: karyawanData
                            }
                        },
                        {
                            text: 'Data Approval SPL', style: 'subheader'
                        },
                        {
                            margin: [0, 5, 0, 5],
                            table: {
                                widths: [30, '*', '*', 'auto'],
                                body: atasanData
                            }
                        },
                        {
                            columns: [
                                {
                                    text: `STATUS`,
                                    width: 60,
                                },
                                {
                                    text: `:`,
                                    width: 20,
                                },
                                {
                                    text: `${DataSPL[1].status.replace(/_/g,' ').toUpperCase()}`,
                                    width: 'auto',
                                }
                            ],
                            bold: false,
                            bold:true,
                            fontSize: 14,
                            margin: [0,0,0,15]
                        },
                        {
                            alignment:"center",
                            table: {
                                widths: ['*', '*', '*', '*'],
                                body: signatureAtasan,
                            },
                            layout: 'noBorders'
                        },
                        

                    ],
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            alignment: 'justify'
                        },
                        subheader: {
                            fontSize: 14,
                            bold: true,
                            margin: [0, 10, 0, 5],
                            alignment: 'center'
                        },
                        content: {
                            fontSize: 12
                        }
                    }
                    
                }

                pdfMake.createPdf(docDefinition).open();
            })
        })

        // Data Table
        $(document).ready(function() {
            let tablePrivate = $('#dataTable1').DataTable({
                retrieve: true,
                lengthMenu: [5, 10, 20, 50, 100, 200, 500],
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'desc']]
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