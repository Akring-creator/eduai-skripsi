import { Button } from "@/components/ui/button";
import Link from "next/link";

const listofItem = ['item1', 'item2', 'item3', 'item1', 'item2', 'item3','item1', 'item2', 'item3','item1', 'item2', 'item3','item1', 'item2', 'item3']

const CoursesPage = () => {
    return ( <div className="flex items-center gap-x-2">
        {listofItem.map((item) => {
            return(
            <Button>
                {item}
            </Button>)
        })}
        <Link href="/teacher/create-quiz">
       <Button>
            Soal Baru
       </Button>
       </Link>
    </div> );
}
 
export default CoursesPage;