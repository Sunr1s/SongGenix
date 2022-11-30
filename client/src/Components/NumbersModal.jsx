import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { autocompleteClasses } from '@mui/material';
import { flexbox } from '@mui/system';


const style = {
    borderRadius: 10,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    height: 1000,
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description"
                        sx={{
                            display: flexbox,
                            margin: 40,
                            ml: 48,
                            fontFamily:'neue',
                            fontSize: 140
                        }}>
                        2/15
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

// const NumbersModal = () => {
//     return (
//         <div className='App'>
//             <div className='NumbersModal'>
//                 <div className="numbers">
//                     <div className="numbers-white-oval">
//                         <p className="numbers-white-oval-text">1/15</p>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default NumbersModal