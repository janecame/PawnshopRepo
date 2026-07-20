import {Offcanvas} from 'react-bootstrap';
import Menu from './Menu';

export default function Sidebar({handleClose, status, handleMenuClick, activeMenu, handleLogout}) {
  
  return (
    <>
        <Offcanvas className="rounded-end w-75" show={status} onHide={handleClose}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='p-0'>
                <Menu handleMenuClick={handleMenuClick} activeMenu={activeMenu} handleLogout={handleLogout}/>
            </Offcanvas.Body>
        </Offcanvas>
    </>
  );
}
