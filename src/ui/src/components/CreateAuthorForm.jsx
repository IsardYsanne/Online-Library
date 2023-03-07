import React, {useState} from 'react';
import library from "../styles/library.module.scss";

const addAuthorUrl = 'http://localhost:8080/authors/save';

const CreateAuthorForm = (props) => {

    const [name, setName] = useState("");

    const {
        show,
        setShow,
        isAuthorForm,
        setIsAuthorForm,
    } = props;

    const validate = (data) => {
        return !data;
    }

    const rejectAuthorForm = () => {
        setShow(!show);
        setIsAuthorForm(!isAuthorForm);
    };

    const addAuthor = () => {
        fetch(addAuthorUrl, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name
            })
        });
    };

    return (
        <div className={library.addBookForm}>
            <div className={library.formTitle}>Создать автора</div>
            <form className={library.formWrapper}>
                <label htmlFor={1} className={library.formLabel}>
                    Введите имя автора
                </label>
                <input
                    id={1}
                    className={library.inputForm}
                    type={"text"}
                    onChange={(e) => {
                        e.preventDefault();
                        setName(e.target.value);
                    }}
                    pattern={"\\s*\\S+.*"}
                    required
                />
                <div className={library.btn_container}>
                    <button
                        className={library.btnSubmit}
                        type={"submit"}
                        onClick={addAuthor}
                        disabled={validate(name)}
                    >
                        Сохранить
                    </button>
                    <button
                        className={library.btnExit}
                        onClick={rejectAuthorForm}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAuthorForm;