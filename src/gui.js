const fs = require("fs");
const fs_date_archivist = require("./core");
const {
   QMainWindow,
   QListView,
   QLineEdit,
   QGridLayout,
   QWidget,
   QLabel,
   FlexLayout,
   QScrollArea,
   QPushButton,
   QListWidget,
   QListWidgetItem,
   QIcon,
   QMessageBox,
   QFileDialog,
   FileMode,
} = require("@nodegui/nodegui");

// for an explanation of why this is here, see stub.c
if (process.env.SETCWD) {
   process.chdir(process.env.SETCWD);
}

const win = new QMainWindow;
const win_width  = 900;
const win_height = 685;
win.setFixedSize(win_width, win_height);
win.setWindowTitle("fs-date-archivist");

const icon_module = require("../res/icon.ico");
const icon_path   = `${__dirname}/${icon_module}`;
win.setWindowIcon(new QIcon(icon_path));

const root = new QWidget;
root.setObjectName("root");
win.setCentralWidget(root);

root.setStyleSheet(require("./gui.css"));

/** running y-offset */
var y = 0;

/** padding */
const p = 10;
/** button height */
const bh = 30;

y += 10;

const lblCwd = new QLabel(root);
const btnChdir = new QPushButton(root);
{
   var x = p;
   const wBtnChdir = 80;
   const wLblCwd = win_width - p - p - wBtnChdir - p;

   function updateLblCwd() {
      lblCwd.setText(`cwd     = ${process.cwd()}`);
   }

   updateLblCwd();
   lblCwd.resize(wLblCwd, bh);
   lblCwd.move(x, y);
   x += p + wLblCwd;

   btnChdir.setText("chdir");
   btnChdir.resize(wBtnChdir, bh);
   btnChdir.move(x, y);

   btnChdir.addEventListener("clicked", () => {
      const fileDialog = new QFileDialog();
      fileDialog.setFileMode(FileMode.Directory);
      fileDialog.exec();
      const [newDir] = fileDialog.selectedFiles();
      process.chdir(newDir);
      updateLblCwd();
   });
}

y += bh + 5;

const lblOutfile = new QLabel(root);
const txtOutfile = new QLineEdit(root);
const btnGo = new QPushButton(root);
{
   var x = p;

   const wLblOutfile = 99;
   const wBtnGo = 80;
   const wTxtOutfile = - p - wLblOutfile - p + win_width - p - wBtnGo - p;

   lblOutfile.setText("outfile = ");
   lblOutfile.move(p, y + 3);
   x += p + wLblOutfile;

   txtOutfile.move(x, y);
   txtOutfile.resize(wTxtOutfile, bh);
   x += p + wTxtOutfile;

   btnGo.setText("start");
   btnGo.resize(wBtnGo, bh);
   btnGo.move(x, y);
}

y += bh + 5;

const lblStatus = new QLabel(root);
function setStatus(status) {
   lblStatus.setText(`status  = ${status}.`);
}
{
   lblStatus.move(p, y);
   lblStatus.resize(-p + win_width - p, bh);
   setStatus("Waiting for user");
}

y += 80;

function newPathList(name) {
   const lblName = new QLabel(root);
   {
      lblName.setText(`${name} paths:`);
      lblName.move(p, y);
   }

   const btnRemove = new QPushButton(root);
   const btnAdd = new QPushButton(root);
   {
      var x = win_width - p;

      const wDepth1Add = 120;
      const wDepth1Remove = 140;

      btnAdd.setText("add path");
      btnRemove.setText("remove path");

      btnAdd.resize(wDepth1Add, bh);
      btnRemove.resize(wDepth1Remove, bh);

      btnRemove.move(x - wDepth1Remove, y);
      x -= wDepth1Remove + p;
      btnAdd.move(x - wDepth1Add, y);
   }

   y += bh + 5;

   const txtPathInput = new QLineEdit(root);
   {
      txtPathInput.move(p, y);
      txtPathInput.resize(win_width - p - p, bh);
   }

   y += bh + 5;

   const hLst = 170;
   const lstPathList = new QListWidget(root);
   {
      lstPathList.move(p, y);
      lstPathList.resize(win_width - p - p, hLst);
   }

   y += hLst + 35;

   btnAdd.addEventListener("clicked", () => {
      const path = txtPathInput.text();
      txtPathInput.clear();
      if (path.length == 0) {
         return;
      }

      const item = new QListWidgetItem;
      item.setText(path);
      lstPathList.addItem(item);
   });

   btnRemove.addEventListener("clicked", () => {
      lstPathList.takeItem(lstPathList.currentRow());
   });

   return lstPathList;
}

const lstDepth1    = newPathList("depth1");
const lstRecursive = newPathList("recursive");

btnGo.addEventListener("clicked", () => {
   const ouf = txtOutfile.text();
   if (ouf.length == 0) {
      setStatus("Enter the output file path");
      return;
   }

   if (fs.existsSync(ouf)) {
      setStatus("Refusing to overwrite the output file. Delete manually");
      return;
   }

   var count;
   const depth1 = [];
   count = lstDepth1.count();
   for (let i = 0; i < count; ++i) {
      depth1.push(lstDepth1.item(i).text());
   }

   const recursive = [];
   count = lstRecursive.count();
   for (let i = 0; i < count; ++i) {
      recursive.push(lstRecursive.item(i).text());
   }

   const obj = fs_date_archivist({depth1, recursive});
   fs.writeFileSync(ouf, JSON.stringify(obj));

   lblStatus.setText("Completed.");
});

win.show();
global.win = win;
