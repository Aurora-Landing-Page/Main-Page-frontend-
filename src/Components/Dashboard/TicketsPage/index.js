import * as React from "react";
import { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import Toast from "../../AlertAndLoader/Toast";
import Alert from "../../AlertAndLoader/Alert";
import Loader from "../../AlertAndLoader/Loader";
import BACKEND_URL from "../../../helper";
import { HiUserRemove } from "react-icons/hi";
import { useTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import QRCode from "../images/QR.jpg";
import "../QRDialog.css";
import "./index.css";
import terms from "./Aurora T&C.pdf";

function TicketCardsLayout() {
  const initialFormData = {
    accomodation: false,
    pronite: false,
    whole_event: true,
    purchaseType: "individual",
    members: [],
  };

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [isGroupPurchaseSelected, setIsGroupPurchaseSelected] = useState(false);
  const [isIndividualPurchaseSelected, setIsIndividualPurchaseSelected] =
    useState(true);

  const [isButtonDisabled4, setButtonDisabled4] = useState(false);
  const [isButtonDisabled8, setButtonDisabled8] = useState(false);

  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [amount, setAmount] = useState(449);

  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messege, setMessege] = useState("");

  const handleFileChange = (event) => {
    const MAX_FILE_SIZE_MB = 1;

    const file = event.target.files[0];

    // Check if file size is less than 1 MB
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setMessege("1 MB is the maximum file size");
      setShowAlert(true);
      return;
    }

    setSelectedFile(file);
    setIsFileUploaded(true);
  };
  const handleOfferClose = async () => {
    setOpen1(false);
    setOpen2(false);
  };

  const handleClose = async () => {
    setSelectedFile(null);
    setIsFileUploaded(false);
    setOpen(false);
  };
  const handlePurchase = async (e) => {
    e.preventDefault();

    if (formData.purchaseType === "") {
      setMessege("Please select either individual or group");
      setShowAlert(true);
      return;
    }

    for (let i = 0; i < formData.members.length; i++) {
      if (formData.members[i].name === "") {
        setMessege("Please enter name of all members");
        setShowAlert(true);
        return;
      }
      if (formData.members[i].email === "") {
        setMessege("Please enter email of all members");
        setShowAlert(true);
        return;
      }
      if (formData.members[i].phone === "") {
        setMessege("Please enter phone number of all members");
        setShowAlert(true);
        return;
      }
    }

    setOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessege("Please upload the screenshot of payment");
      setShowAlert(true);
      return;
    }

    if (formData.purchaseType === "") {
      setMessege("Please select either individual or group");
      setShowAlert(true);
      return;
    }

    for (let i = 0; i < formData.members.length; i++) {
      if (formData.members[i].name === "") {
        setMessege("Please enter name of all members");
        setShowAlert(true);
        return;
      }
      if (formData.members[i].email === "") {
        setMessege("Please enter email of all members");
        setShowAlert(true);
        return;
      }
      if (!formData.members[i].phone) {
        setMessege("Please enter phone number of all members");
        setShowAlert(true);
        return;
      }
    }

    // get reciept id
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/createPurchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await res.json();
    const recieptId = data.receiptId;
    console.log(selectedFile);

    var formDataPhoto = new FormData();
    formDataPhoto.append("image", selectedFile);
    formDataPhoto.append("receiptId", recieptId);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessege("Payment completed, Please check your email!");
      setShowToast(true);
    }, 3000);

    setOpen(false);

    await fetch(`${BACKEND_URL}/uploadScreenshot`, {
      method: "POST",
      body: formDataPhoto,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          // setMessege("Your image has been uploaded successfully!");
          // setShowToast(true);
          // setSelectedFile(null);
          // setIsFileUploaded(false);
          // setOpen(false);
          formData.members.splice(formData.length - formData.length, 1);
          setFormData({ ...formData });
        } else {
          // setMessege("Payment Unsuccessful");
          // setShowAlert(true);
          // setSelectedFile(null);
          // setIsFileUploaded(false);
          // setOpen(false);
          formData.members.splice(formData.length - formData.length, 1);
          setFormData({ ...formData });
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.error("Error:", error);
        setMessege("Issue with your internet");
        setShowAlert(true);
      });
  };

  const handleToastClose = () => {
    setMessege("");
    setShowToast(false);
  };

  const handleAlertClose = () => {
    setMessege("");
    setShowAlert(false);
  };

  // const addMember = () => {
  //   console.log("add member");
  //   formData.members.push({
  //     email: "",
  //     name: "",
  //     phone: "",
  //   });

  //   setFormData({ ...formData });
  // };

  const addMember = () => {
    console.log("add member");
    setFormData((prevFormData) => ({
      ...prevFormData,
      members: [
        ...prevFormData.members,
        {
          email: "",
          name: "",
          phone: "",
        },
      ],
    }));
    setIsGroupPurchaseSelected(true);
  };

  useEffect(() => {
    console.log(formData);
    if (formData.purchaseType === "group") {
      if (formData.accomodation) {
        if (formData.members.length < 4) {
          setAmount(1799 + formData.members.length * 1799);
        } else if (
          formData.members.length >= 4 &&
          formData.members.length < 10
        ) {
          // 1 free
          setAmount(1799 + formData.members.length * 1799 - 1350);
        } else if (formData.members.length === 10) {
          setAmount((formData.members.length - 1) * 1799 + 2998);
        } else if (formData.members.length > 10) {
          // 3 free
          setAmount(1799 + formData.members.length * 1799 - 3 * 799);
        }
      } else {
        if (formData.members.length < 10) {
          setAmount(449 + formData.members.length * 449 );
        }
       else if (formData.members.length === 10) {
          setAmount(449 + formData.members.length * 449 + 450);
        } else {
          setAmount(449 + formData.members.length * 449- 3 * 449);
        }
      }
    } else {
      if (formData.accomodation) {
        setAmount(1799);
      } else {
        setAmount(449);
      }
    }
  }, [formData]);

  return (
    <div className="flex items-center justify-center  ">
      {showToast && (
        <Toast message={messege} duration={3000} onClose={handleToastClose} />
      )}
      {showAlert && (
        <Alert message={messege} duration={3000} onClose={handleAlertClose} />
      )}
      {loading ? (
        <Loader />
      ) : (
        <div class="flex items-center justify-center  mt-10 md:mt-10 relative sm:left-24">
          <div class="login_box  ">
            <form className="flex flex-col justify-center items-center px-4 pb-12">
              <h2 className="login_h2 py-2 relative pt-6   lg:left-4 px-4 sm:px-0 flex justify-center ">
                Attend
              </h2>
              <div class=" text-lg sm:text-xl space-y-2 sm:space-y-4 font-medium sm:font-semibold flex flex-col relative  left-3">
                <div class="flex flex-col sm:flex-row  ">
                  <div class="flex gap-2 items-center sm:basis-1/2 mb-4">
                    <input
                      type="radio"
                      id="individualPurchase"
                      name="purchaseType"
                      value="individual"
                      class="mr-1 leading-tight"
                      onChange={(e) => {
                        formData.purchaseType = !e.target.checked
                          ? "group"
                          : "individual";
                        if (e.target.checked) {
                          formData.members = [];
                          setFormData({ ...formData });
                        }

                        setIsGroupPurchaseSelected(false);
                        setIsIndividualPurchaseSelected(true);
                      }}
                      checked={isIndividualPurchaseSelected}
                    />
                    <label for="individualPurchase">Individual Purchase</label>
                  </div>
                  <div class="flex gap-2 items-center">
                    <input
                      type="radio"
                      id="groupPurchase"
                      name="purchaseType"
                      value="group"
                      class="mr-2 leading-tight"
                      onChange={(e) => {
                        formData.purchaseType = e.target.checked
                          ? "group"
                          : "individual";
                        setFormData({ ...formData });

                        if (e.target.checked) {
                          setIsIndividualPurchaseSelected(false);
                        }
                        setIsGroupPurchaseSelected(e.target.checked);
                      }}
                      checked={isGroupPurchaseSelected}
                    />
                    <label for="groupPurchase" className="flex flex-col ">
                      <span>Group Purchase</span>
                      <span
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        <button
                          // disabled={formData.members.length === 4 || formData.members.length === 10}
                          onClick={(e) => {
                            e.preventDefault();
                            formData.purchaseType = "group";

                            setFormData({ ...formData });
                            setIsGroupPurchaseSelected(true);
                            setIsIndividualPurchaseSelected(false);
                            formData.members = [];
                            setFormData({ ...formData });

                            console.log(formData.members.length);

                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            console.log(formData.members.length);

                            // setButtonDisabled4(true);
                          }}
                          className="offerbtn"
                          // style={isButtonDisabled4 ?
                          //   ({ cursor: "not-allowed" }) : ({ cursor: "pointer" })}
                        >
                          4+1(Free)
                        </button>
                        {console.log(formData.members.length)}
                        <button
                          for="groupPurchase"
                          //  disabled={formData.members.length === 10}
                          onClick={(e) => {
                            e.preventDefault();
                            formData.purchaseType = "group";

                            setFormData({ ...formData });
                            setIsGroupPurchaseSelected(true);
                            setIsIndividualPurchaseSelected(false);
                            formData.members = [];
                            setFormData({ ...formData });

                            console.log(formData.members.length);

                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            addMember();
                            console.log(formData.members.length);
                            // setButtonDisabled8(true);
                            // setButtonDisabled4(true)
                          }}
                          className="offerbtn"
                          // style={isButtonDisabled8 ?
                          //   ({ cursor: "not-allowed" }) : ({ cursor: "pointer" })}
                        >
                          8+3(Free)
                        </button>
                        <button
                          className="offerbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            formData.members = [];
                            setFormData({ ...formData });
                            formData.purchaseType = "group";
                            setFormData({ ...formData });
                            setIsGroupPurchaseSelected(true);
                            setIsIndividualPurchaseSelected(false);
                            console.log(formData);
                          }}
                        >
                          Others
                        </button>
                      </span>
                    </label>
                  </div>
                </div>
                {/* <div className="flex flex-col sm:flex-row ">
                  <label class="flex basis-1/2 items-center">
                    <input
                      type="radio"
                      id="pronite"
                      name="option"
                      value="pronite"
                      class="mr-2 leading-tight"
                      onChange={(e) => (formData.pronite = e.target.checked)}
                    />{" "}
                    Pronite(449/-)
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      id="wholeEvent"
                      name="option"
                      value="Whole Event"
                      class="mr-2 leading-tight"
                      onChange={(e) =>
                        (formData.whole_event = e.target.checked)
                      }
                    />{" "}
                    Whole Event(749/-)
                  </label>
                </div> */}

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="accommodation"
                    name="option"
                    value="Accommodation"
                    class="mr-2 leading-tight"
                    onChange={(e) => {
                      formData.accomodation = e.target.checked;
                      setFormData({ ...formData });
                    }}
                  />{" "}
                  Accommodation
                </label>
                {formData?.accomodation && (
                  <div className="text-sm">
                    <b>Note*</b>
                    <ul>
                      <li>
                        1. Accomodation charges are 750/- per day for one
                        person.
                      </li>
                      <li>2. Check Out Timing is 10:00 AM.</li>
                    </ul>
                  </div>
                )}
                <div
                  id="groupPurchaseFields"
                  // hidden={formData.purchaseType !== "group"}
                  className={` mt-2 ${
                    formData.purchaseType !== "group" ? "hidden" : "block"
                  } `}
                >
                  {formData.members.map((member, index) => {
                    return (
                      <div className="mb-4 flex flex-col right-4 relative  gap-3 justify-center items-center w-full ">
                        <div className="flex flex-col gap-3 sm:flex-row justify-center w-[90%]">
                          <input
                            type="text"
                            id={`groupMemberName${index}`}
                            placeholder="Name"
                            onChange={(e) => {
                              formData.members[index].name = e.target.value;
                            }}
                            class="pl-4 mr-2 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                          <input
                            type="email"
                            // id={groupMemberEmail${index}}
                            // name={groupMemberEmail${index}}
                            placeholder="Gender"
                            // onChange={(e) => {
                            //   formData.members[index].email = e.target.value;
                            // }}
                            class="pl-4  py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row w-[90%] justify-center gap-3">
                          <input
                            type="email"
                            id={`groupMemberEmail${index}`}
                            name={`groupMemberEmail${index}`}
                            placeholder="Email"
                            onChange={(e) => {
                              formData.members[index].email = e.target.value;
                            }}
                            class="pl-4  py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                          <input
                            type="tel"
                            id={`groupMemberPhone${index}`}
                            name={`groupMemberPhone${index}`}
                            placeholder="Phone"
                            onChange={(e) => {
                              formData.members[index].phone = e.target.value;
                            }}
                            class="pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-start sm:justify-center gap-3">
                    <button
                      type="button"
                      class=" bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline "
                      onClick={addMember}
                    >
                      + Add Group Member
                    </button>
                    <button
                      type="button"
                      class=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                      onClick={() => {
                        formData.members.splice(formData.length - 1, 1);

                        setFormData({ ...formData });
                      }}
                    >
                      <HiUserRemove />
                    </button>
                  </div>
                </div>
                <div size="h5">
                  <a
                    href={terms}
                    class="btn-1 outer-shadow hover-in-shadow"
                    target="next_page"
                    style={{ textDecoration: "underline" }}
                  >
                    Terms and conditions
                    <DownloadIcon />
                  </a>
                </div>
              </div>

              <div class="login_button py-8">
                <a className="login_a">
                  <button className="login_btn px-2" onClick={handlePurchase}>
                    Purchase (
                    {`${
                      formData.members.length === 4
                        ? amount - 449
                        : formData.members.length === 10
                        ? amount - 1797
                        : amount
                    }`}
                    .rs)
                    {/* Passes will be out soon */}
                  </button>
                </a>
                <div className="mt-2 ">
                  *you will receive your passes via email after payment
                </div>
              </div>
            </form>
          </div>
          <Dialog open={open1} onClose={handleOfferClose}>
            <DialogTitle>{"This is the 4+1 offer"}</DialogTitle>
          </Dialog>
          <Dialog open={open2} onClose={handleOfferClose}>
            <DialogTitle>{"This is the 8+3 offer"}</DialogTitle>
          </Dialog>

          <Dialog
            // fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            className="Dialog"
          >
            <DialogTitle id="responsive-dialog-title">
              {`Pay ${amount} Thorugh The Below QR`}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              {/* X */}
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <DialogContentText>
                <img src={QRCode} alt="QR Code" className="Dialog_QR" />
                {/* Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex accusantium sapiente repellat facere sed porro ab culpa eius tempore. Hic labore cupiditate sapiente perferendis minus temporibus id consequatur quod voluptatem! */}
                Upload the screenshot of payment
                <br />
                <input
                  accept="image/*"
                  // className={classes.input}
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    className="Dialog_Upload"
                    variant="outlined"
                    color="success"
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
                {isFileUploaded && (
                  <DoneIcon style={{ color: "green", marginLeft: "10px" }} />
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {/* <Button autoFocus onClick={handleClose}>
            Disagree
          </Button> */}
              <Button
                onClick={handleUpload}
                variant="contained"
                color="success"
                className="Dialog_btn"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default TicketCardsLayout;
