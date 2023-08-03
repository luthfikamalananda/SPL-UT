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
                        <td style='text-transform: uppercase;'><h6><span class="badge badge-danger" id='badgeStatus'>${spl[1].status.replace(/_/g,' ')}</span></h6></td>
                        <td>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnDelete'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            <a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a>
                        </td>
                    </tr>`

                    if (foundSPL.status != findStatus) {
                        const btnDelete = document.getElementById('btnDelete')
                        btnDelete.setAttribute('style', 'display:none;')
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
                    objSPL[1].status = 'Approved' // Add Status in index 1

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
                    objSPL[1].status = 'diajukan_ke_dhhc' // Restore Status in index 1

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
                
                // console.log('karyawan data', karyawanData, 'legh', karyawanData.length);

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
                            margin: [0, 5, 0, 15],
                            table: {
                                widths: [30, '*', '*', '*', 'auto', '*'],
                                body: karyawanData
                            }
                        },
                        {
                            text: 'Data Approval SPL', style: 'subheader'
                        },
                        {
                            margin: [0, 5, 0, 15],
                            table: {
                                widths: [30, '*', '*', '*'],
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
                            fontSize: 14
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