function UniversalModal({ title, children, show, onHide }) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              /* Perform actions here */
            }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }