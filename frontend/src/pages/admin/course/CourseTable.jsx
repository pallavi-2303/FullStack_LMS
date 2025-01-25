import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]
function CourseTable() {
  const navigate=useNavigate();
  const {data,isLoading}=useGetCreatorCourseQuery();
  if(isLoading) return <h1>Loading...</h1>
  console.log(data);
  return (
    <div>
   <Button onClick={()=>navigate('/admin/course/create')}>Create a new Course</Button> 
    <Table>
      <TableCaption>A list of your recent courses...</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell>{course?.coursePrice || "NA"}</TableCell>
            <TableCell><Badge>{course?.isPublished ? "Published" :"Draft"}</Badge></TableCell>
            <TableCell className="text-right">{course.courseTitle}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="ghost" onClick={()=>navigate(`${course._id}`)}><Edit/></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
     
    </Table>
    </div>
  )
}

export default CourseTable