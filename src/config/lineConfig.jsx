//Imagenes
    //Reynosa
import motor1Img from '@assets/reynosa/motor_1.png';
import motor2Img from '@assets/reynosa/motor_2.png';
import motor3Img from '@assets/reynosa/motor_3.png';
import motor4Img from '@assets/reynosa/motor_4.png';
import motor5Img from '@assets/reynosa/motor_5.png';
import motor6Img from '@assets/reynosa/motor_6.png';
import motor7Img from '@assets/reynosa/motor_7.png';
    //Embraco
import preensambleImg from '@assets/embraco/materials/preensamble.png';
import cduImg from '@assets/embraco/materials/cdu.png';
import electronicsImg from '@assets/embraco/materials/electronics.png';
import insinkeratorImg from '@assets/embraco/materials/insinkerator.png';
import ecmfanImg from '@assets/embraco/materials/ecmfan.png';
import thermoImg from '@assets/embraco/materials/thermo_v2.png';

//Catálogo: Lineas de Reynosa
export const linesCatalog = {
    Reynosa: {
        line1: {
            id: 1,
            imgURL: motor1Img
        },
        line2: {
            id: 2,
            imgURL: motor2Img
        },
        line4: {
            id: 3,
            imgURL: motor3Img
        },
        line7: {
            id: 4,
            imgURL: motor4Img
        },
        line14: {
            id: 5,
            imgURL: motor5Img
        },
        line16: {
            id: 6,
            imgURL: motor6Img
        },
        line30: {
            id: 7,
            imgURL: motor7Img
        },
    },
    Embraco: {
        cdu: {
            id: "cdu",
            imgURL: cduImg
        },
        thermo: {
            id: "thermo",
            imgURL: thermoImg
        },
        electronics: {
            id: "electronics",
            imgURL: electronicsImg
        },
        ecmfan: {
            id: "ecmfan",
            imgURL: ecmfanImg
        },
        insinkerator1:{
            id: "insinkerator1",
            imgURL: insinkeratorImg
        },
        insinkerator2:{
            id: "insinkerator2",
            imgURL: insinkeratorImg
        },
        preensamble: {
            id: "preensamble",
            imgURL: preensambleImg
        }
    }
}