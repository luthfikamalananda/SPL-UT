import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, doc, getDocs, getDoc } from "firebase/firestore";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

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
                            <th>Actions</th>
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
                    <td><a href="#" data-id='${splid}' class="delete" data-toggle="modal" id='btnPrint' style='color:#444439fa;'><i class="material-icons" data-toggle="tooltip" title="Print">print</i></a></td>
                </tr>`
            }
        });

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