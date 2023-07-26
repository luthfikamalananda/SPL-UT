import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
const adminPage = {
    async render(){
        return `<!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <h1 class="h3 mb-2 text-gray-800">CREATE ACCOUNT</h1>
                    <p class="mb-4">Gawekke create account e masbro </p>

                    <!-- DataTales Example -->
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Data Karyawan</h6>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                        <th><input type="checkbox" name="select_all" value="1" id="example-select-all"></th>
                                            <th>Name</th>
                                            <th>Position</th>
                                            <th>Office</th>
                                            <th>Age</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>UID1</td>
                                            <td>Angelica Ramos</td>
                                            <td>Chief Executive Officer (CEO)</td>
                                            <td>London</td>
                                            <td>47</td>
                                        </tr>
                                        <tr>
                                            <td>UID2</td>
                                            <td>Gavin Joyce</td>
                                            <td>Developer</td>
                                            <td>Edinburgh</td>
                                            <td>42</td>
                                        </tr>
                                        <tr>
                                            <td>UID3</td>
                                            <td>Jennifer Chang</td>
                                            <td>Regional Director</td>
                                            <td>Singapore</td>
                                            <td>28</td>
                                        </tr>
                                        <tr>
                                            <td>UID4</td>
                                            <td>Brenden Wagner</td>
                                            <td>Software Engineer</td>
                                            <td>San Francisco</td>
                                            <td>28</td>
                                        </tr>
                                        <tr>
                                            <td>UID5</td>
                                            <td>Fiona Green</td>
                                            <td>Chief Operating Officer (COO)</td>
                                            <td>San Francisco</td>
                                            <td>48</td>
                                        </tr>
                                        <tr>
                                            <td>UID6</td>
                                            <td>Prescott Bartlett</td>
                                            <td>Technical Author</td>
                                            <td>London</td>
                                            <td>27</td>
                                        </tr>
                                        <tr>
                                            <td>UID7</td>
                                            <td>Gavin Cortez</td>
                                            <td>Team Leader</td>
                                            <td>San Francisco</td>
                                            <td>22</td>
                                        </tr>
                                        <tr>
                                            <td>UID8</td>
                                            <td>Martena Mccray</td>
                                            <td>Post-Sales support</td>
                                            <td>Edinburgh</td>
                                            <td>46</td>
                                        </tr>
                                        <tr>
                                            <td>UID9</td>
                                            <td>Unity Butler</td>
                                            <td>Marketing Designer</td>
                                            <td>San Francisco</td>
                                            <td>47</td>
                                        </tr>
                                        <tr>
                                            <td>UID10</td>    
                                            <td>Howard Hatfield</td>
                                            <td>Office Manager</td>
                                            <td>San Francisco</td>
                                            <td>51</td>
                                        </tr>
                                        <tr>
                                            <td>UID11</td>
                                            <td>Hope Fuentes</td>
                                            <td>Secretary</td>
                                            <td>San Francisco</td>
                                            <td>41</td>
                                        </tr>
                                        <tr>
                                            <td>UID12</td>
                                            <td>Jonas Alexander</td>
                                            <td>Developer</td>
                                            <td>San Francisco</td>
                                            <td>30</td>
                                        </tr>
                                        <tr>
                                            <td>UID13</td>
                                            <td>Shad Decker</td>
                                            <td>Regional Director</td>
                                            <td>Edinburgh</td>
                                            <td>51</td>
                                        </tr>
                                        <tr>
                                            <td>UID14</td>
                                            <td>Michael Bruce</td>
                                            <td>Javascript Developer</td>
                                            <td>Singapore</td>
                                            <td>29</td>
                                        </tr>
                                        <tr>
                                            <td>UID15</td>
                                            <td>Donna Snider</td>
                                            <td>Customer Support</td>
                                            <td>New York</td>
                                            <td>27</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->`
    },

    async afterRender(){
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                'columnDefs': [{
                    'targets': 0,
                    'checkboxes': {
                        'selectRow': true
                    }
                 }],
                 'order': [[1, 'asc']]
            });

            // // Handle click on "Select all" control
            // $('#example-select-all').on('click', function(){
            //     // Get all rows with search applied
            //     var rows = table.rows({ 'search': 'applied' }).nodes();

            //     // row.each(function(index,elem){
            //     //     var checkbox_value = $(elem).val();
            //     //     console.log(elem);
            //     //     console.log('check', checkbox_value);
            //     //     //Do something with 'checkbox_value'
            //     // });
            //     // Check/uncheck checkboxes for all rows in the table
            //     $('input[type="checkbox"]', rows).prop('checked', this.checked);
            // });

            //   // Handle click on checkbox to set state of "Select all" control
            // $('#example tbody').on('change', 'input[type="checkbox"]', function(){
            //     // If checkbox is not checked
            //     if(!this.checked){
            //     var el = $('#example-select-all').get(0);
            //     // If "Select all" control is checked and has 'indeterminate' property
            //     if(el && el.checked && ('indeterminate' in el)){
            //         // Set visual state of "Select all" control
            //         // as 'indeterminate'
            //         el.indeterminate = true;
            //     }
            //     }
            // });


            //  // Handle form submission event
            // $('#frm-example').on('submit', function(e){
            //     var form = this;

            //     // Iterate over all checkboxes in the table
            //     table.$('input[type="checkbox"]').each(function(){
            //     // If checkbox doesn't exist in DOM
            //     if(!$.contains(document, this)){
            //         // If checkbox is checked
            //         if(this.checked){
            //             // Create a hidden element
            //             $(form).append(
            //                 $('<input>')
            //                 .attr('type', 'hidden')
            //                 .attr('name', this.name)
            //                 .val(this.value)
            //             );
            //         }
            //     }
            //     });
            // });


            
          });

          
        
    }
}
export default adminPage;