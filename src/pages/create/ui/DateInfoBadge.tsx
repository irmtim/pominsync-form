import moment from "moment";
import { OverlayTrigger, Popover } from "react-bootstrap";

type Props = {
  date: Date
}

const DateInfoBadge = ({date}: Props) => {

  const timeLimit = moment(date, 'YYYY-MM-DDTHH:mm').format('HH:mm')

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Справка</Popover.Header>
      <Popover.Body>
        Мы принимаем поминовения на следующий день до <strong>{timeLimit}</strong>.<br/>
        После ближайшая дата становится послезавтра.
      </Popover.Body>
    </Popover>
  )

  return (
    <OverlayTrigger placement="top" trigger='click' overlay={popover} >
      <span className="badge rounded-pill text-bg-secondary">*</span>
    </OverlayTrigger>
  );
};

export {DateInfoBadge}