import { Button } from "primereact/button"
import Arrows from "../../assets/arrows_8003820_1280.jpg"
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Card } from "primereact/card";

export const Hero = () => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div className="grid grid-nogutter surface-0 text-800">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 text-center md:text-left flex align-items-center">
                    <section>
                        <span className="block text-6xl font-bold mb-1">Timelines</span>
                        <div className="text-3xl text-primary font-bold mb-3">Get everyone on the same timeline</div>
                        <p className="mt-0 mb-4 text-700 line-height-3">Create and share project timelines with your team</p>

                        <Button label="Learn More" type="button" className="mr-3 p-button-raised" onClick={() => setVisible(true)} />
                        <Dialog header="More about Timeline"
                            visible={visible}
                            style={{ width: '50vw' }}
                            onHide={() => { if (!visible) return; setVisible(false); }}
                            onMaskClick={() => { if (!visible) return; setVisible(false); }}
                            content={() => (
                                <Card title="More about Timeline"
                                    subTitle="This is a personal project I am using to learn different technologies. It is still in testing and development."
                                    className="!bg-Cora">
                                    <p className="m-0">
                                        You can create a timeline of events. Share those timelines with connections that also have accounts
                                        by adding the connection using their username.
                                    </p>
                                </Card>)}
                        ></Dialog>
                    </section>
                </div>
                <div className="w-full md:w-1/2 overflow-hidden">
                    <img src={Arrows} alt="arrows" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
        </div>



    )
}