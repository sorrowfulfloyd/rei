import React from "react";
import "./Modal.css";

function UpdateDevice({ toggleModal, device }) {
	return (
		<>
			<div className="modal">
				<div onClick={toggleModal} className="overlay"></div>
				<div className="modal-content">
					<h2>Hello Modal</h2>
					<p>{device}</p>
					<p>TODO: fetch the device with provided id here and edit any field</p>
					<button
						onClick={(e) => {
							toggleModal();
							e.preventDefault();
						}}
					>
						{" "}
						CLOSE
					</button>
				</div>
			</div>
		</>
	);
}

export default UpdateDevice;
