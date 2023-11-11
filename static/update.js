let newRow = 2

function addRow() {
    let newline = document.createElement('div')
    newline.innerHTML = `
    <div class="form-row" id="formRow${newRow}">
        <select name="size" id="inputSize">
            <option value="" disabled selected>ขนาด</option>
            <option value="4*6">4*6</option>
            <option value="5*7">5*7</option>
            <option value="6*8">6*8</option>
            <option value="8*10">8*10</option>
            <option value="8*12">8*12</option>
            <option value="8*20">8*20</option>
            <option value="10*12">10*12</option>
            <option value="10*15">10*15</option>
            <option value="12*15">12*15</option>
            <option value="12*18">12*18</option>
            <option value="15*20">15*20</option>
            <option value="15*21">15*21</option>
            <option value="16*20">16*20</option>
            <option value="10*27">10*27</option>
            <option value="12*27">12*27</option>
            <option value="A4">A4</option>
        </select>
        <select name="action" id="action">
            <option value="" disabled selected>ทำอะไร</option>
            <option value="cut">ตัด</option>
            <option value="wash">ล้าง</option>
            <option value="sell">ขาย</option>
            <option value="editcut">แก้สต๊อกตัด</option>
            <option value="editready">แก้สต๊อกพร้อมส่ง</option>
        </select>
        <input type="number" name="quantity" id="quantity">
        <button type="button" onclick="deleteRow(${newRow})">ลบ</button>
    </div>`
    document.getElementById('inputContainer').append(newline)
    newRow++
}

function deleteRow(row) {
    document.getElementById('formRow'+row).innerHTML = ""
}

function check() {
    let dropdownAllFilled = true
    let inputAllFilled = true
    const dropdown = document.querySelectorAll('select')
    const input = document.querySelectorAll('input')

    dropdown.forEach(dropdown => {
        if (dropdown.value === "") {
            Swal.fire({
                icon: 'error',
                title: 'ใส่ข้อมูลไม่ครบ',
            })
            dropdownAllFilled = false
            return
        }
    })

    input.forEach(input => {
        if (input.value === "") {
            Swal.fire({
                icon: 'error',
                title: 'ใส่ข้อมูลไม่ครบ',
            })
            inputAllFilled = false
            return
        }
    })

    if (dropdownAllFilled == true && inputAllFilled == true) {
        document.getElementById('form').submit()
    }
}