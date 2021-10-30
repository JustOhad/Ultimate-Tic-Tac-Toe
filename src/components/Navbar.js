import React, {useState} from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom';
//Dialog
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//Confetti
import Confetti from './Confetti';

function Navbar() {
    //Dialog
    var [records, setRecords] = useState([]);
    var [showDialog, setShowDialog] = useState(false);

    var handleShowDialog = () => {
        var leaderBoardRecords = localStorage.getItem("LeaderBoardRecords");
        //If Storage Empty - First Time
        if(leaderBoardRecords == null)
        {
            setRecords([]);
        }
        else
        {
            setRecords(JSON.parse(leaderBoardRecords));
        }
        setShowDialog(true);
    };

    var handleCloseDialog = () => {
        setShowDialog(false);
    };
    
    var listItems = records.sort((a, b) => a.moves > b.moves ? 1 : -1).map((record) =>
        <tr key={record.id}>
            <th scope="row">{records.indexOf(record) + 1}</th>
            <td>{record.name}</td>
            <td>{record.boardSize} X {record.boardSize}</td>
            <td>{record.moves}</td>
        </tr>
    );

    return (
        <>
            <nav id="navbar">
                <div id="navbar-container">
                    <Link to="/" id="navbar-logo">
                        <img id="logoImage" src="/images/sayata-logo.gif"></img>
                        <h2 id="logoText">Ultimate Tic Tac Toe</h2>
                    </Link>
                    <div id="center-links">
                        <Link to="/" id="leaderboard" onClick={handleShowDialog}>
                            <h2 id="leaderboardText">Leader Board</h2>
                        </Link>
                    </div>
                </div>
            </nav>
            <Modal show={showDialog} onHide={handleCloseDialog} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Leader Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="scrollableTable">
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Board Size</th>
                                    <th scope="col">Moves</th>
                                </tr>
                            </thead>
                            <tbody id="leaderBoardTable">
                                {listItems}
                            </tbody>
                        </table>
                        {records.length == 0 ? <p id="noRecordsText">No records yet</p> : ''}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </Modal.Footer>
                <Confetti></Confetti>
            </Modal>
        </>
    )
}

export default Navbar
