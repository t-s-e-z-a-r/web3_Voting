import { Input, Button, Form, notification, Tabs } from 'antd';

const VoteForm = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
          const response = await fetch('http://localhost:8000/transfer/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          notification.success({
            message: 'Vote Successful',
            description: `Transaction Hash: ${result.transaction_hash}`,
          });
          form.resetFields(); // Reset form after submission
        } catch (error) {
          notification.error({
            message: 'Vote Failed',
            description: error.message || 'Failed to submit vote',
          });
        }
      };

    return (      
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
            name="candidate"
            label="Candidate Address"
            rules={[{ required: true, message: 'Please input the candidate address!' }]}
            >
                <Input placeholder="Enter candidate address" />
            </Form.Item>
            <Form.Item
            name="coins"
            label="Vote Amount"
            rules={[{ required: true, message: 'Please input the vote amount!' }]}
            >
                <Input type="number" placeholder="Enter vote amount" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit Vote
                </Button>
            </Form.Item>
        </Form>
    )
}