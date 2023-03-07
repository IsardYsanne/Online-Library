import React from 'react';
import CreateBookForm from "../CreateBookForm.jsx";
import CreateAuthorForm from "../CreateAuthorForm.jsx";
import CreateGenreForm from "../CreateGenreForm.jsx";

const CreateForm = (props) => {

    const {
        show,
        setShow,
        isBookForm,
        isAuthorForm,
        setIsBookForm,
        setIsAuthorForm
    } = props;

    return (
        isBookForm ?
        <CreateBookForm
            show={show}
            setShow={setShow}
            isBookForm={isBookForm}
            setIsBookForm={setIsBookForm}
        />
        : isAuthorForm ?
            <CreateAuthorForm
                show={show}
                setShow={setShow}
                isAuthorForm={isAuthorForm}
                setIsAuthorForm={setIsAuthorForm}
            />
            :
            <CreateGenreForm
                show={show}
                setShow={setShow}
            />
    );
};

export default CreateForm;