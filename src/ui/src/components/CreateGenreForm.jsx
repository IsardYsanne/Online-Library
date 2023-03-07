import React, {useState} from 'react';
import library from "../styles/library.module.scss";

const addGenreUrl = 'http://localhost:8080/genres/save';

const CreateGenreForm = (props) => {

    const [genreName, setGenreName] = useState("");

    const {
        show,
        setShow,
    } = props;

    const validate = (data) => {
        return !data;
    }

    const addGenre = () => {
        fetch(addGenreUrl, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                genreName
            })
        });
    };

    const showForm = () => {
        setShow(!show);
    };

    return (
        <div className={library.addBookForm}>
            <div className={library.formTitle}>Создать жанр</div>
            <form className={library.formWrapper}>
                <label htmlFor={1} className={library.formLabel}>
                    Введите название жанра
                </label>
                <input
                    id={1}
                    className={library.inputForm}
                    type={"text"}
                    onChange={(e) => {
                        e.preventDefault();
                        setGenreName(e.target.value);
                    }}
                    pattern={"\\s*\\S+.*"}
                    required
                />
                <div className={library.btn_container}>
                    <button
                        className={library.btnSubmit}
                        type={"submit"}
                        onClick={addGenre}
                        disabled={validate(genreName)}
                    >
                        Сохранить
                    </button>
                    <button
                        className={library.btnExit}
                        onClick={showForm}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGenreForm;