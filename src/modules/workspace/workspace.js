import React, { useEffect, useRef, useState } from 'react';
import App from '../../application/App';
import areatbService from '../../services/areatb.service';
import { Panel, Button, TagGroup, Tag, Modal, Form, useToaster, Schema, Message, ButtonGroup, Stack, IconButton, VStack } from 'rsuite';
import { FcAddRow } from "react-icons/fc";
import { FaRegTrashCan, FaPenToSquare } from "react-icons/fa6";
import RemindIcon from '@rsuite/icons/legacy/Remind';



export default function Workspace() {
    const title = 'Area de Trabalho';
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => {
        //console.log(item);
        //setOpenDelete(true);
    };

    const handleCloseDelete = () => setOpenDelete(false);

    const fechaLimpaForm = () => {
        setFormValue({
            nome: '',
            descricao: ''
        });
        handleClose();
    }

    const [areatb, setAreatb] = useState([]);
    useEffect(() => {
        areatbService.getAreatb().then((response) => {
            setAreatb(response.data);
        });
    }, []);

    const model = Schema.Model({
        nome: Schema.Types.StringType().isRequired('Campo obrigatório.').minLength(3, 'Mínimo de 3 caracteres.').maxLength(50, 'Máximo de 50 caracteres.'),
        descricao: Schema.Types.StringType().isRequired('Campo obrigatório.')
    });
    const [formValue, setFormValue] = useState({
        nome: '',
        descricao: ''
    });
    const formRef = useRef();
    const [formError, setFormError] = useState({});
    const toaster = useToaster();

    const salvaDados = () => {
        if (!formRef.current.check()) {
            toaster.push(msgWarnig(formError, 'salvar'), { placement: 'topEnd' }, { duration: 18000 });
            return;
        }

        if (formValue.nome === '' || formValue.descricao === '') {
            toaster.push(msgError('Preencha todos os campos!', 'salvar'), { placement: 'topEnd' }, { duration: 8000 });
            return;
        }

        areatbService.insertAreatb(formValue).then((response) => {
            toaster.push(msgSuccess(response.data, 'salvar'), { placement: 'topEnd' }, { duration: 8000 });
            handleClose();
            areatbService.getAreatb().then((response) => {
                setAreatb(response.data);
            });
        }).catch((error) => {
            toaster.push(msgError(error, 'salvar'), { placement: 'topEnd' }, { duration: 8000 });
        });

        setFormValue({
            nome: '',
            descricao: ''
        });
    }

    const deletaDados = () => {
        areatbService.deleteAreatb(1).then((response) => {
            console.log(response);
            if (response.success){
                toaster.push(msgSuccess(response.data, 'deletar'), { placement: 'topEnd' }, { duration: 8000 });
            }
            else{
                toaster.push(msgError(response.Message, 'deletar'), { placement: 'topEnd' }, { duration: 8000 });
            }
            
            handleCloseDelete();
            areatbService.getAreatb().then((response) => {
                setAreatb(response.data);
            });
        }).catch((error) => {
            toaster.push(msgError(error, 'deletar'), { placement: 'topEnd' }, { duration: 8000 });
        });
    }


    const msgWarnig = (formError, funcao) => (
        <Message showIcon type='warning' header={`Erro ao tentar ${funcao} ${title}!'`} >
            {
                Object.keys(formError).map((key) => {
                    console.log(key, formError[key]);
                    return <p>{key} - {formError[key]}</p>
                })
            }
        </Message>
    );

    const msgSuccess = (msg, funcao) => (
        <Message showIcon type='success' header={`${title} ${funcao} com sucesso!`} >
            <p>{msg.nome} </p>
        </Message>
    );

    const msgError = (msg, funcao) => (
        <Message showIcon type='error' header={`Erro ao tentar ${funcao} ${title}!`} >
            <p>{msg}</p>
        </Message>
    );

    return (
        <App>
            <h1>Areas de Trabalho </h1>
            <br />
            <Button color="green" appearance="primary" size="lg" endIcon={<FcAddRow />} onClick={handleOpen}>
                Adicionar Areas de Trabalho
            </Button>
            <br />
            <br />
            {areatb.map((item) => (
                <>
                    <Panel header={<Stack justifyContent="space-between">
                        <span>{item.nome}</span>
                        <ButtonGroup>
                            <IconButton size='lg' icon={<FaPenToSquare />} />
                            <IconButton size='lg' icon={<FaRegTrashCan />} onClick={handleOpenDelete} />
                        </ButtonGroup>
                    </Stack>} bordered >
                        <p>{item.descricao}</p>

                        Tabelas vinculadas:
                        <TagGroup>
                            {item.tabelas.map((tabela) => (
                                <Tag color='blue'>
                                    <p>{tabela.nome}</p>
                                </Tag>
                            ))}
                        </TagGroup>

                    </Panel>
                    <br />
                </>
            ))}

            <Modal open={open} onClose={handleClose} backdrop={'static'}
                keyboard={false}>

                <Modal.Header>
                    <Modal.Title><h3>Criar {title}</h3></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form fluid layout='vertical'
                        formValue={formValue}
                        model={model}
                        onChange={setFormValue}
                        ref={formRef}
                        onCheck={setFormError}>

                        <Form.Group>
                            <Form.ControlLabel><b>Nome</b></Form.ControlLabel>
                            <Form.Control name='nome' />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel><b>Descrição</b></Form.ControlLabel>
                            <Form.Control name='descricao' componentClass='textarea' rows={3} />
                        </Form.Group>



                    </Form>



                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" onClick={salvaDados}>
                        Salvar
                    </Button>
                    <Button onClick={fechaLimpaForm} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>


            </Modal>

            <Modal backdrop="static" role="alertdialog" open={openDelete} onClose={handleCloseDelete} size="xs">
                <Modal.Body>
                    <RemindIcon style={{ color: '#ffb300', fontSize: 24 }} />
                    Tem certeza que deseja excluir?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deletaDados} appearance="primary">
                        Sim
                    </Button>
                    <Button onClick={handleCloseDelete} appearance="subtle">
                        Não
                    </Button>
                </Modal.Footer>
            </Modal>




        </App>
    );
}